import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext.js";

function SignUp() {
  const { signup } = useUser();
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div
        className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-lg"
        style={{ backgroundColor: "#2c2c2c", color: "#e0e0e0" }}
      >
        <h2
          className="text-2xl font-bold mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Sign Up
        </h2>

        {signupError && (
          <div
            className={`p-2 mb-4 rounded ${
              signupError.includes("successful")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {signupError}
          </div>
        )}

        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={Yup.object({
            username: Yup.string()
              .min(3, "Username must be at least 3 characters")
              .required("Username is required"),
            password: Yup.string()
              .min(6, "Password must be at least 6 characters")
              .required("Password is required"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            setSignupError("");
            try {
              await signup(values.username, values.password);
              setSignupError("Signup successful! Redirecting...");
              setTimeout(() => navigate("/dashboard"), 1500); // Redirect after success
            } catch (error) {
              setSignupError(error.message || "Signup failed");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <label className="block text-sm font-medium">Username:</label>
              <Field
                type="text"
                name="username"
                className="w-full p-2 border rounded"
                style={{
                  backgroundColor: "#1a1a1a",
                  borderColor: "#8f7e4f",
                  color: "#e0e0e0",
                }}
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-red-500 text-sm"
              />

              <label className="block text-sm font-medium">Password:</label>
              <div className="relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full p-2 border rounded pr-10"
                  style={{
                    backgroundColor: "#1a1a1a",
                    borderColor: "#8f7e4f",
                    color: "#e0e0e0",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 rounded hover:bg-opacity-90"
                style={{ backgroundColor: "#8f7e4f", color: "#e0e0e0" }}
              >
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </button>

              <div className="text-center mt-4">
                <span className="text-gray-600">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-blue-500 hover:underline"
                >
                  Login
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default SignUp;
