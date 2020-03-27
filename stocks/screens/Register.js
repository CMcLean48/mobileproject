import React, { Fragment, navigation } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { Button } from "react-native-elements";
import { Formik } from "formik";
import * as Yup from "yup";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
import ErrorMessage from "../components/ErrorMessage";
import { AsyncStorage } from "react-native";
import firebase from "../firebase";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .label("Email")
    .email("Enter a valid email")
    .required("Please enter a registered email"),
  password: Yup.string()
    .label("Password")
    .required()
    .min(4, "Password must have more than 4 characters "),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Confirm Password must matched Password")
    .required("Confirm Password is required")
});

export default function Register({ navigation }) {
  const goToLogin = () => navigation.navigate("Login");
  const API_CREATE_URL =
    "https://ssdstockappapi.azurewebsites.net/api/User/create";

  async function _storeData(token) {
    try {
      await AsyncStorage.setItem("JWT_TOKEN", token);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmit(values) {
    return new Promise(async (resolve, reject) => {
      if (values.email.length > 0 && values.password.length > 0) {
        await setTimeout(() => {
          firebase
            .auth()
            .createUserWithEmailAndPassword(values.email, values.password)
            .then(response => {
              alert("User Registered - " + response.user.email);
              firebase
                .auth()
                .currentUser.getIdTokenResult()
                .then(tokenResponse => {
                  fetch(API_CREATE_URL, {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${tokenResponse.token}`
                    }
                  }).then(response => {
                    if (response.status == 201) {
                      //Only Store Token if Everything Is Successful
                      _storeData(tokenResponse.token);
                      resolve(response.status);
                    } else {
                      reject("API ERROR: " + JSON.stringify(response));
                    }
                  });
                });
            })
            .catch(error => {
              reject("Firebase " + error);
            });
        }, 6000);
      }
    });
  }
  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={{
          email: "",
          password: "",
          confirmPassword: ""
        }}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          //Lock Register Button
          setSubmitting(true);

          try {
            let registerSuccess = await handleSubmit(values);

            //Success
            if (registerSuccess == 201) {
              alert("YAY! - It's Portfolio Time!");
              navigation.navigate("Portfolio");
            } else {
              alert("Hmmm Something Went Wrong");
            }
          } catch (error) {
            //Fail
            alert(error);
            resetForm();
          } finally {
            //Unlock Register Button
            setSubmitting(false);
          }
        }}
        validationSchema={validationSchema}
      >
        {({
          handleChange,
          values,
          handleSubmit,
          errors,
          isValid,
          touched,
          handleBlur,
          isSubmitting
        }) => (
          <Fragment>
            <FormInput
              name="email"
              value={values.email}
              onChangeText={handleChange("email")}
              placeholder="Enter email"
              autoCapitalize="none"
              iconName="ios-mail"
              iconColor="#2C384A"
              onBlur={handleBlur("email")}
              autoFocus
            />
            <ErrorMessage errorValue={touched.email && errors.email} />
            <FormInput
              name="password"
              value={values.password}
              onChangeText={handleChange("password")}
              placeholder="Enter password"
              secureTextEntry
              iconName="ios-lock"
              iconColor="#2C384A"
              onBlur={handleBlur("password")}
            />
            <ErrorMessage errorValue={touched.password && errors.password} />
            <FormInput
              name="password"
              value={values.confirmPassword}
              onChangeText={handleChange("confirmPassword")}
              placeholder="Confirm password"
              secureTextEntry
              iconName="ios-lock"
              iconColor="#2C384A"
              onBlur={handleBlur("confirmPassword")}
            />
            <ErrorMessage
              errorValue={touched.confirmPassword && errors.confirmPassword}
            />
            <View style={styles.buttonContainer}>
              <FormButton
                buttonType="outline"
                onPress={handleSubmit}
                title="SIGNUP"
                buttonColor="#F57C00"
                disabled={!isValid || isSubmitting}
                loading={isSubmitting}
              />
            </View>
          </Fragment>
        )}
      </Formik>
      <Button
        title="Have an account? Login"
        onPress={goToLogin}
        titleStyle={{
          color: "#039BE5"
        }}
        type="clear"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  buttonContainer: {
    margin: 25
  }
});
