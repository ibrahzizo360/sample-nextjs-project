import React from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { api } from '@/services/api';
import { authenticate } from '@/services/authenticate';
import { useRouter } from 'next/router';

const Page = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: true
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
      password: Yup.string().required("Required")
    }),
    onSubmit: async (values, { setFieldError }) => {
      try {
        const response = await api.login(values.email, values.password);
        if (response.success) {
          if (response.result.data) {
            authenticate(response.result.data);
            router.push('app/home')
          } else {
            throw new Error('Invalid response');
          }
        } else {
          const fields = ['email', 'password'];
          fields.forEach((field) => {
            if (response.result.data && response.result.data[field]) {
              setFieldError(field, response.result.data[field].join(', '));
            }
          });
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    },    
  });

  return (
    <div className="grid place-items-center h-screen bg-green-500">
      <form onSubmit={formik.handleSubmit}>
      <div className=" flex flex-col gap-7 p-6 bg-white">
        <div className="text-center">
        <h2 className="font-bold text-2xl mb-6">LOGIN</h2>
        <p>Please Enter you credentials to login</p>  
        </div>  
      <input placeholder="Email"
      name="email"
      className="bg-gray-100 p-3 "
      type="email"
      onChange={formik.handleChange}
      value={formik.values.email}
      />
      <span>{formik.errors.email}</span>
      <input placeholder="Password"
      name="password"
      className="bg-gray-100 p-3"
      type="password"
      onChange={formik.handleChange}
      value={formik.values.password}
      />
      <span>{formik.errors.password}</span>
      <button className="bg-green-500 rounded-md p-1 text-white">Login</button>
      </div>
      </form>
    </div>
  )
}

export default Page

