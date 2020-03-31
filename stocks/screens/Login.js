import React, { Fragment } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { Button } from "react-native-elements";
import { Formik } from "formik";
import * as Yup from "yup";
import { AsyncStorage } from "react-native";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";

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
    .min(6, "Password must have more than 6 characters ")
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
    return new Promise(async (resolve, reject) => {
      if (values.email.length > 0 && values.password.length > 0) {
        firebase
          .auth()
          .signInWithEmailAndPassword(values.email, values.password)
          .then(reponse => {
            firebase
              .auth()
              .currentUser.getIdTokenResult()
              .then(tokenResponse => {
                 _storeData(tokenResponse.token);
                resolve();
              })
              .catch(error => reject("Firebase " + error));
          })
          .catch(error => reject("Firebase " + error));
      }
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={async values => {
          try {
            await handleSubmit(values);
            navigation.navigate("Stocks");
          } catch (error) {
            //Fail
            alert(error);
            values.password = "";
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
