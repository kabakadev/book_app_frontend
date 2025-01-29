import {Formik,Form,Field,ErrorMessage} from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
function Login(){
    const [loginError, setLoginError] = useState('');
    return (
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
            if (data.error){
                setLoginError(data.error)
            } else {
                console.log('Login successful:', data )
            }
        })
        .catch(error => {
            setLoginError("Something went wrong, please try again")
            console.log("Error:", error)
        })
        .finally(()=> setSubmitting(false))
    }}
    
    >
        {({ isSubmitting }) => (
        <Form>
            <label>Username:</label>
            <Field type="text" name="username"/>
            <ErrorMessage name="username" component="div" style={{ color: 'red' }} />

            <label>Password:</label>
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
            {loginError && <div style={{ color: 'red', marginTop: '10px' }}>{loginError}</div>}


            <button type="submit" disabled={isSubmitting}>Login</button>
        </Form>
        )}
    </Formik>
    )
}
export default Login