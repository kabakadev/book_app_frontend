import {Formik,Form,Field} from 'formik';
function Login(){
    return (
    <Formik initialValues={{username:'',password:''}}>
        <Form>
            <label>Username:</label>
            <Field type="text" name="username"/>

            <label>Password:</label>
            <Field type="password" name="password" />

            <button type="submit">Login</button>
        </Form>
    </Formik>
    )
}
export default Login