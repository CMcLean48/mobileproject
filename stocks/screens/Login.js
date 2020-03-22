import React, { Fragment, navigation } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { Button } from "react-native-elements";
import { Formik } from "formik";
import * as Yup from "yup";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
import { AsyncStorage } from "react-native";

import ErrorMessage from "../components/ErrorMessage";
import firebase from "../firebase";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .label("Email")
    .email("Enter a valid email")
    .required("Please enter a registered email"),
  password: Yup.string()
    .label("Password")
    .required()
    .min(4, "Password must have more than 4 characters ")
});

export default function Login({ navigation }) {
  const goToSignup = () => navigation.navigate("Register");

  async function _storeData(token) {
    try {
      await AsyncStorage.setItem("JWT_TOKEN", token);
    } catch (error) {
      console.error(error);
    }
  }
  async function handleSubmit(values) {
    if (values.email.length > 0 && values.password.length > 0) {
      await setTimeout(() => {
        firebase
          .auth()
          .signInWithEmailAndPassword(values.email, values.password)
          .then(
            response => alert("Signed In User: " + response.user.email),
            navigation.navigate("Portfolio")
          )
          .catch(error => alert("Firebase Login Error: " + error));

        // alert(JSON.stringify(values));
      }, 3000);
      await firebase
        .auth()
        .currentUser.getIdTokenResult()
        .then(response => {
          _storeData(response.token);
        });
      alert("you are now logged in");
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={values => {
          handleSubmit(values);
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
            <View style={styles.buttonContainer}>
              <FormButton
                buttonType="outline"
                onPress={handleSubmit}
                title="LOGIN"
                buttonColor="#039BE5"
                disabled={!isValid || isSubmitting}
                loading={isSubmitting}
              />
            </View>
          </Fragment>
        )}
      </Formik>
      <Button
        title="Don't have an account? Please Register"
        onPress={goToSignup}
        titleStyle={{
          color: "#F57C00"
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
