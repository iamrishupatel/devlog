import { useContext, useState } from "react";
import s from "./styles/Form.module.css";
import { UserContext } from "../../lib/context/userContext";
import { Formik } from "formik";
import * as Yup from "yup";

import MarkdownPreview from "../MarkdownPreview";

const Form = ({
  initialValues,
  handleSubmit,
  areActionAlwaysVisible,
  onDismiss,
}) => {
  const [preview, setPreview] = useState(false);
  const { user } = useContext(UserContext);
  const validationSchema = Yup.object().shape({
    body: Yup.string().required(),
  });
  return (
    <div className={s.container}>
      <img src={user?.photoURL || "/user.svg"} alt="" />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          dirty,
          isSubmitting,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit} className={s.form}>
            {/* ==== preview ==== */}
            {preview && (
              <div className={s.preview}>
                <MarkdownPreview content={values.body} />
              </div>
            )}

            {/* ==== form input ==== */}
            <div className={preview ? "hidden" : ""}>
              <textarea
                name="body"
                placeholder="Add to the discussion..."
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.body}
              ></textarea>
            </div>

            {/* ==== actions ==== */}
            {areActionAlwaysVisible ? (
              <div className={s.actions}>
                <button
                  className="btn-accent"
                  type="submit"
                  disabled={!dirty || errors.body || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
                <button
                  className="btn btn-blue"
                  type="button"
                  onClick={() => setPreview(!preview)}
                  disabled={!dirty || errors.body || isSubmitting}
                >
                  {preview ? "Continue editing" : "Preview"}
                </button>
                <button
                  className="btn"
                  type="button"
                  onClick={onDismiss ? onDismiss : resetForm}
                  disabled={isSubmitting}
                >
                  Dismiss
                </button>
              </div>
            ) : (
              dirty &&
              !errors.body && (
                <div className={s.actions}>
                  <button
                    className="btn-accent"
                    type="submit"
                    disabled={!dirty || errors.body || isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                  <button
                    className="btn btn-blue"
                    type="button"
                    onClick={() => setPreview(!preview)}
                    disabled={!dirty || errors.body || isSubmitting}
                  >
                    {preview ? "Continue editing" : "Preview"}
                  </button>
                  <button
                    className="btn"
                    type="button"
                    onClick={onDismiss ? onDismiss : resetForm}
                    disabled={isSubmitting}
                  >
                    Dismiss
                  </button>
                </div>
              )
            )}
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Form;

Form.defaultProps = {
  areActionAlwaysVisible: false,
  onDismiss: false,
};
