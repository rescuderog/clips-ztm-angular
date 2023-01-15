//we're creating this interface so we can modelize the data we get from the register form into a congruent type

export default interface IUser {
    email: string,
    password?: string,
    age: number,
    name: string,
    phoneNumber : string
}