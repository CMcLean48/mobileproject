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
  name: Yup.string()
    .label("Name")
    .required()
    .min(2, "Must have at least 2 characters"),
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
          .createUserWithEmailAndPassword(values.email, values.password)
          .then(
            response => alert("User Registered - " + response.user.email),
            navigation.navigate("Portfolio")
          )
          .catch(error => alert("Firebase Register Error: " + error));
        //	this.props.navigation.navigate('App');
        //alert(JSON.stringify(values));
      }, 3000);
      await firebase
        .auth()
        .currentUser.getIdTokenResult()
        .then(response => {
          _storeData(response.token);
        });
      alert("you are now registered");
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: ""
        }}
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
              name="name"
              value={values.name}
              onChangeText={handleChange("name")}
              placeholder="Enter your full name"
              iconName="md-person"
              iconColor="#2C384A"
              onBlur={handleBlur("name")}
              autoFocus
            />
            <ErrorMessage errorValue={touched.name && errors.name} />
            <FormInput
              name="email"
              value={values.email}
              onChangeText={handleChange("email")}
              placeholder="Enter email"
              autoCapitalize="none"
              iconName="ios-mail"
              iconColor="#2C384A"
              onBlur={handleBlur("email")}
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
