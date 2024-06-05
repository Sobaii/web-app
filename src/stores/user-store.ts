import { create } from 'zustand'

type UserStore = {
    email: string
    picture: string
    setEmail: (email: string) => void
    setpicture: (picture: string) => void
}

export const useUser = create<UserStore>()((set) => ({
    email: '',
    picture: '',
    setEmail: (email) => set({ email }),
    setpicture: (picture) => set({ picture }),
}))