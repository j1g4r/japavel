import { defineComponent, h, ref, withModifiers } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { JCard, JInput, JButton } from "../jui/components";
import { css } from "../jui/core/styled";
import { theme } from "../jui/core/theme";
import { useAuth } from "../stores/auth";

export default defineComponent({
  name: "Login",
  setup() {
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const rememberMe = ref(false);
    const errorMessage = ref("");
    const isLoading = ref(false);
    const auth = useAuth();

    const login = async () => {
      errorMessage.value = "";
      isLoading.value = true;

      try {
        await auth.login(email.value, password.value, rememberMe.value);
        router.push("/dashboard");
      } catch (error: any) {
        errorMessage.value = error.message || "Login failed. Please try again.";
        console.error("Login error:", error);
      } finally {
        isLoading.value = false;
      }
    };

    // Styles
    const pageStyle = css({
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.neutral.gray50,
      ".dark &": { backgroundColor: theme.colors.neutral.gray900 },
    });

    const wrapperStyle = css({
      width: "100%",
      maxWidth: "440px",
      padding: "1.5rem",
    });

    const headerStyle = css({
      textAlign: "center",
      marginBottom: "2rem",
    });

    const titleStyle = css({
      fontSize: "1.875rem",
      fontWeight: "800",
      marginBottom: "0.5rem",
      background: `linear-gradient(to right, ${theme.colors.brand.primary}, ${theme.colors.brand.secondary})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    });

    const subtitleStyle = css({
      color: theme.colors.neutral.gray500,
    });

    const formStyle = css({
      display: "flex",
      flexDirection: "column",
      gap: "1.25rem",
    });

    const optionsStyle = css({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "0.875rem",
    });

    const rememberStyle = css({
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      color: theme.colors.neutral.gray600,
      cursor: "pointer",
    });

    const linkStyle = css({
      color: theme.colors.brand.primary,
      fontWeight: "600",
      textDecoration: "none",
      ":hover": { textDecoration: "underline" },
    });

    const footerStyle = css({
      textAlign: "center",
      marginTop: "1.5rem",
      fontSize: "0.875rem",
      color: theme.colors.neutral.gray500,
    });

    return () => {
      return h("div", { class: pageStyle }, [
        h("div", { class: wrapperStyle }, [
          h(
            JCard,
            { variant: "glass", padding: "lg" },
            {
              default: () => [
                // Header
                h("div", { class: headerStyle }, [
                  h("h2", { class: titleStyle }, "Welcome back"),
                  h(
                    "p",
                    { class: subtitleStyle },
                    "Please enter your details to sign in.",
                  ),
                ]),

                // Form
                h(
                  "form",
                  {
                    class: formStyle,
                    onSubmit: withModifiers(login, ["prevent"]),
                  },
                  [
                    // Error message
                    errorMessage.value
                      ? h(
                          "div",
                          {
                            class: css({
                              padding: "0.75rem 1rem",
                              borderRadius: theme.radius.lg,
                              backgroundColor: theme.colors.status.error + "15",
                              color: theme.colors.status.error,
                              fontSize: "0.875rem",
                              fontWeight: "500",
                              marginBottom: "0.5rem",
                            }),
                          },
                          errorMessage.value,
                        )
                      : null,
                    h(JInput, {
                      modelValue: email.value,
                      "onUpdate:modelValue": (v: string) => (email.value = v),
                      label: "Email Address",
                      placeholder: "name@company.com",
                      type: "email",
                      required: true,
                    }),

                    h(JInput, {
                      modelValue: password.value,
                      "onUpdate:modelValue": (v: string) =>
                        (password.value = v),
                      label: "Password",
                      placeholder: "••••••••",
                      type: "password",
                      required: true,
                    }),

                    h("div", { class: optionsStyle }, [
                      h("label", { class: rememberStyle }, [
                        h("input", {
                          type: "checkbox",
                          checked: rememberMe.value,
                          onChange: (e: Event) =>
                            (rememberMe.value = (
                              e.target as HTMLInputElement
                            ).checked),
                        }),
                        " Remember me",
                      ]),
                      h(
                        "a",
                        { href: "#", class: linkStyle },
                        "Forgot password?",
                      ),
                    ]),

                    h(
                      JButton,
                      {
                        type: "submit",
                        size: "lg",
                        block: true,
                        color: "primary",
                        disabled: isLoading.value,
                      },
                      () => (isLoading.value ? "Signing in..." : "Sign In"),
                    ),
                  ],
                ),

                // Footer
                h("p", { class: footerStyle }, [
                  "Don't have an account? ",
                  h(
                    RouterLink,
                    { to: "/register", class: linkStyle },
                    () => "Create one",
                  ),
                ]),
              ],
            },
          ),
        ]),
      ]);
    };
  },
});
