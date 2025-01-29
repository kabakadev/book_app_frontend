import {Formik,Form,Field} from 'formik';
function Login(){
    return (
    <Formik initialValues={{username:'',password:''}}>
        <Form>
            <label>Username:</label>
        </Form>
    </Formik>
    )
}
export default Login