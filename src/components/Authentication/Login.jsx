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
    onSubmit={(values) => {
        console.log('Form submitted with:', values);
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