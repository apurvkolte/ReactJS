import React from 'react'
import { signIn, useSession } from "next-auth/react";


const login = () => {
    const router = useRouter();
    const { data: session } = useSession();
    return (
        <div>
            <div className="d-flex justify-content-center align-items-center">
                <p className="text-center me-3">Login in with</p>

                <button type='button' className="btn border bg-light btn-lg me-2" onClick={() => signIn("google")}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google G" width="30" />
                    <span className='text-dark'>Google</span>
                </button>

            </div>

        </div>
    )
}

export default login
