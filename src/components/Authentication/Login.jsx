import {Formik,Form,Field,ErrorMessage} from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
function Login(){
    const [loginError, setLoginError] = useState('');
    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            {loginError && (
                <div className={`p-2 mb-4 rounded ${loginError.includes("successful") ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {loginError}
                </div>
            )}
    <Formik 
    initialValues={{username:'',password:''}}
    validationSchema={Yup.object({
        username: Yup.string()
            .min(3, 'Username must be at least 3 characters')
            .required('Username is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
    })}
    onSubmit={(values, {setSubmitting}) => {
        setLoginError('');

        fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message){
                setLoginError(data.message)
            } else if (data.error){
                setLoginError(data.error)
            }
        })
        .catch( ()=> {
            setLoginError("Something went wrong, please try again")
            
        })
        .finally(()=> setSubmitting(false))
    }}
    
    >
        {({ isSubmitting }) => (
        <Form className="space-y-4">
            <label className="block text-sm font-medium">Username:</label>
            <Field type="text" name="username"className="w-full p-2 border rounded"/>
            <ErrorMessage name="username" component="div"  className="text-red-500 text-sm" />

            <label className="block text-sm font-medium">Password:</label>
            <Field type="password" name="password" className="w-full p-2 border rounded" />
            <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
           
            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
        </Form>
        )}
    </Formik>
    </div>
    )
}
export default Login