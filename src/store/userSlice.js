import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'user',
    initialState: {
        firstName: 'Name',
        lastName: 'Name',
        andrewId: 'AndrewID',
        email: 'andrewID@andrew.cmu.edu',
        role: 'user'
    },
    reducers: {
        setUser: state => {

        },
        editUser: (state, action) => {
            state = { ...action.payload }
        },
        deleteUser: state => {

        }
    }
})
export const { setUser, editUser, deleteUser } = userSlice.actions
export default userSlice.reducer