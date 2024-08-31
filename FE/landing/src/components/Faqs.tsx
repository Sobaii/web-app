import Image from 'next/image'

import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-faqs.jpg'

const faqs = [
  [
    {
      question: 'Does ByteTheBill.ai handle different invoice formats?',
      answer:
        'Absolutely, ByteTheBill.ai is designed to process various invoice and expense formats with ease.',
    },
    {
      question: 'Can I export my data into different types of files?',
      answer: 'Certainly, we support exporting your data into customizable Excel files, tailored to your needs.',
    },
    {
      question: 'How do I get started with ByteTheBill.ai?',
      answer:
        'Just sign up, drag and drop your invoices and expenses, and watch as the data is seamlessly extracted into your custom fields.',
    },
  ],
  [
    {
      question: 'Is ByteTheBill.ai secure for sensitive financial data?',
      answer:
        'Security is our top priority. Your financial data is encrypted and stored securely, ensuring your information remains confidential.',
    },
    {
      question:
        'ByteTheBill.ai seems too good to be true, what’s the catch?',
      answer:
        'No catch! Our commitment is to simplify your financial documentation process with a user-friendly interface and powerful data extraction technology.',
    },
    {
      question:
        'Are there any limitations on the number of invoices I can process?',
      answer:
        'Our plans come with different levels of usage to fit your business needs. Check out our pricing page for more details.',
    },
  ],
  [
    {
      question: 'How accurate is the data extraction feature?',
      answer:
        'ByteTheBill.ai uses advanced AI algorithms to ensure high accuracy in data extraction from your invoices and expenses.',
    },
    {
      question: 'Will there be more features added to ByteTheBill.ai?',
      answer: 'Absolutely! We’re constantly working on new features to make your financial management even easier.',
    },
    {
      question: 'I need help, how can I contact support?',
      answer:
        'Our support team is here to help! Drop us an email and we’ll get back to you as soon as possible.',
    },
  ],
]

export function Faqs() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
    >
      <Image
        className="absolute left-1/2 top-0 max-w-none -translate-y-1/4 translate-x-[-30%]"
        src={backgroundImage}
        alt=""
        width={1558}
        height={946}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
          >
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            If you have more questions, our support team is ready to assist you. Reach out and we'll get back to you promptly.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-8">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="font-display text-lg leading-7 text-slate-900">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
