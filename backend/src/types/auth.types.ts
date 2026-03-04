export type BaseUser = {
    fullName:string
    email:string
    phone:string
}

export type CredentialUser = BaseUser & {
    provider: "credentials"
    hashedPassword: string
    providerId:never
}

export type OAuthUser = BaseUser & {
    provider: string
    providerId:string
    hashedPassword: never
}



export type createUserInput = CredentialUser | OAuthUser



export type SignUp ={
    
}