require("dotenv").config();
const {
  TextractClient,
  AnalyzeExpenseCommand,
  StartExpenseAnalysisCommand,
  GetExpenseAnalysisCommand,
} = require("@aws-sdk/client-textract");
const { readFileSync } = require("fs");

const REGION = process.env.AWS_REGION;
const textractClient = new TextractClient({ region: REGION });

const startTextractAnalysis = async (bucketName, fileName) => {
  const params = {
    DocumentLocation: {
      // Specifies the location of the document to be processed
      S3Object: {
        Bucket: bucketName,
        Name: fileName,
      },
    },
    FeatureTypes: ["FORMS"], // Specify the feature types to analyze
  };
  try {
    const response = await textractClient.send(
      new StartExpenseAnalysisCommand(params)
    );
    return response.JobId;
  } catch (err) {
    console.log("StartDocumentAnalysis erorr: ", err);
    throw new Error("Error analyzing expense document");
  }
};

async function getTextractAnalysis(jobId) {
  let params = { JobId: jobId };
  let finished = false;

  const allDocumentsResults = [];

  while (!finished) {
    try {
      const data = await textractClient.send(
        new GetExpenseAnalysisCommand(params)
      );

      if (data.JobStatus === "SUCCEEDED") {
        for (const expenseDocument of data.ExpenseDocuments) {
          const documentResult = {};

          for (const doc of expenseDocument.SummaryFields) {
            let keyText = "OTHER";
            if (doc.Type && doc.Type.Text !== "OTHER") {
              keyText = doc.Type.Text;
            } else if (doc.LabelDetection && doc.LabelDetection.Text) {
              keyText = doc.LabelDetection.Text;
            }

            // Store both the text value and the confidence level in an object
            let valueText = "";
            let valueConfidence = 0;
            if (doc.ValueDetection) {
              valueText = doc.ValueDetection.Text || "";
              valueConfidence = doc.ValueDetection.Confidence || 0;
            }

            // Store both the text value and the confidence level in an object
            documentResult[keyText] = {
              text: valueText,
              confidence: valueConfidence,
            };
            documentResult["FILE_PAGE"] = {
              text: doc.PageNumber,
              confidence: 100,
            };
          }

          let filteredResult = filterDuplicates(documentResult);
          allDocumentsResults.push(filteredResult);
        }

        if (data.NextToken) {
          params.NextToken = data.NextToken;
        } else {
          finished = true;
        }
      } else if (data.JobStatus === "FAILED") {
        console.log("Analysis failed:");
        throw new Error("Textract analysis failed");
      } else {
        console.log("Analysis still in progress...");
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    } catch (err) {
      console.log("GetDocumentAnalysis error:", err);
      throw new Error("Failed to get Textract analysis results");
    }
  }

  return allDocumentsResults;
}
const analyzeExpenseDocument = async (bucketName, s3Key) => {
  const params = {
    Document: {
      S3Object: {
        Bucket: bucketName,
        Name: s3Key,
      },
    },
  };

  // List of all expected fields
  const expectedFields = [
    "FILE_PAGE",
    "FILE_NAME",
    "INVOICE_RECEIPT_DATE",
    "VENDOR_NAME",
    "VENDOR_ADDRESS",
    "TOTAL",
    "SUBTOTAL",
    "TAX",
    "VENDOR_PHONE",
    "STREET",
    "GRATUITY",
    "CITY",
    "STATE",
    "COUNTRY",
    "ZIP_CODE",
    "CATEGORY",
  ];

  // Initialize the result object with default values
  const result = {};
  expectedFields.forEach((field) => {
    result[field] = {
      text: "",
      confidence: 0.0,
    };
  });

  try {
    const command = new AnalyzeExpenseCommand(params);
    const response = await textractClient.send(command);

    response.ExpenseDocuments[0].SummaryFields.forEach((doc) => {
      let keyText =
        doc.Type.Text !== "OTHER" ? doc.Type.Text : doc.LabelDetection.Text;

      result[keyText] = {
        text: doc.ValueDetection.Text,
        confidence: doc.ValueDetection.Confidence,
      };

      // Set FILE_PAGE to 100 confidence as it is always detected
      result["FILE_PAGE"] = { text: doc.PageNumber.toString(), confidence: 100 };
    });

    let filteredResult = filterDuplicates(result);
    return filteredResult;
  } catch (err) {
    console.error("Error:", err);
    throw new Error("Error analyzing expense document");
  }
};


function filterDuplicates(obj) {
  const filteredResult = {};
  const seenKeys = new Set();

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (!seenKeys.has(key)) {
        // Directly assign the object containing text and confidence
        filteredResult[key] = obj[key];
        seenKeys.add(key);
      } else {
        // Optional: Handle duplicates, e.g., by comparing confidence levels
      }
    }
  }

  return filteredResult;
}

module.exports = {
  startTextractAnalysis,
  getTextractAnalysis,
  analyzeExpenseDocument,
};
