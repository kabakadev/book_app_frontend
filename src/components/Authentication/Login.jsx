import {Formik,Form,Field} from 'formik';
import * as Yup from 'yup';
function Login(){
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
        console.log('Form submitted with:', values);

        fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        })
        .then(response => response.json())
        .then(data => {
            console.log('backend server: ',data )
        })
        .catch(error => console.log('Error:', error))
        .finally(()=> setSubmitting(false))
    }}
    
    >
        {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
            <label>Username:</label>
            <Field type="text" name="username"/>

            <label>Password:</label>
            <Field type="password" name="password" />

            <button type="submit">Login</button>
        </Form>
        )}
    </Formik>
    )
}
export default Login