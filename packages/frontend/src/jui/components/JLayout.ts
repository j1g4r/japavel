import { defineComponent, h } from "vue";
import { css, glass, meshGradient, noise } from "../core/styled";
import { theme } from "../core/theme";
import { RouterLink, useRoute } from "vue-router";
import { useAuth } from "../../stores/auth";

export default defineComponent({
  name: "JLayout",
  props: {
    withSidebar: { type: Boolean, default: true },
  },
  setup(props, { slots }) {
    const route = useRoute();
    const auth = useAuth();

    // Styles
    const layoutStyle = css({
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      background: `${noise(0.02)}, ${meshGradient([
        theme.colors.neutral.gray50,
        "hsl(250, 60%, 95%)",
        "hsl(330, 60%, 95%)",
        theme.colors.neutral.gray100,
      ])}`,
      color: theme.colors.neutral.gray900,
      fontFamily: '"Outfit", sans-serif',
    });

    const headerContainer = css({
      position: "sticky",
      top: "1.25rem",
      zIndex: 100,
      width: "100%",
      padding: "0 2rem",
    });

    const headerStyle = css({
      ...glass(0.7, 24),
      height: "72px",
      display: "flex",
      alignItems: "center",
      borderRadius: theme.radius.xl,
      boxShadow: theme.shadow.md,
      border: `1px solid ${theme.surfaces.border}`,
      padding: "0 2rem",
    });

    const headerContent = css({
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    });

    const logoStyle = css({
      fontSize: "1.75rem",
      fontWeight: "900",
      letterSpacing: "-0.04em",
      background: `linear-gradient(135deg, ${theme.colors.brand.primary}, ${theme.colors.brand.secondary})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      cursor: "pointer",
      transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      ":hover": { transform: "scale(1.05)" },
    });

    const navStyle = css({
      display: "flex",
      gap: theme.spacing.md,
      alignItems: "center",
    });

    const navLinkClass = (isActive: boolean) =>
      css({
        fontWeight: "600",
        color: isActive
          ? theme.colors.brand.primary
          : theme.colors.neutral.gray500,
        fontSize: "0.9375rem",
        textDecoration: "none",
        padding: "0.6rem 1.25rem",
        borderRadius: theme.radius.lg,
        transition: "all 0.3s ease",
        background: isActive ? theme.surfaces.active : "transparent",
        ":hover": {
          color: theme.colors.brand.primary,
          background: theme.surfaces.active,
        },
      });

    const mainContainer = css({
      display: "flex",
      flex: 1,
      width: "100%",
      paddingTop: "3rem",
    });

    const mainInner = css({
      display: "flex",
      flex: 1,
      width: "100%",
      padding: "0 2rem",
      gap: "2.5rem",
    });

    const sidebarStyle = css({
      width: "280px",
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
    });

    const sidebarItem = (path: string) => {
      const isActive = route.path === path;
      return css({
        padding: "1rem 1.25rem",
        borderRadius: theme.radius.lg,
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        fontWeight: "600",
        color: isActive
          ? theme.colors.brand.primary
          : theme.colors.neutral.gray600,
        fontSize: "1rem",
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        background: isActive ? theme.colors.neutral.white : "transparent",
        boxShadow: isActive ? theme.shadow.md : "none",
        border: `1px solid ${isActive ? theme.surfaces.border : "transparent"}`,
        ":hover": {
          background: theme.colors.neutral.white,
          transform: "translateX(5px)",
          color: theme.colors.brand.primary,
        },
      });
    };

    const contentStyle = css({
      flex: 1,
      minWidth: 0,
      pb: "4rem",
    });

    return () => {
      return h("div", { class: layoutStyle }, [
        // Floating Header
        h("div", { class: headerContainer }, [
          h("header", { class: headerStyle }, [
            h("div", { class: headerContent }, [
              h(
                RouterLink,
                { to: "/", class: css({ textDecoration: "none" }) },
                () => h("div", { class: logoStyle }, "Japavel"),
              ),
              h("nav", { class: navStyle }, [
                h(
                  RouterLink,
                  {
                    to: "/dashboard",
                    class: navLinkClass(route.path === "/dashboard"),
                  },
                  () => "Dashboard",
                ),
                h(
                  RouterLink,
                  {
                    to: "/settings",
                    class: navLinkClass(route.path === "/settings"),
                  },
                  () => "Settings",
                ),
                h(
                  "button",
                  {
                    class: navLinkClass(false),
                    onClick: () => auth.logout(),
                    style: {
                      cursor: "pointer",
                      border: "none",
                      background: "none",
                      padding: "0.6rem 1.25rem",
                      fontSize: "0.9375rem",
                      borderRadius: theme.radius.lg,
                    },
                  },
                  () => "Logout",
                ),
              ]),
            ]),
          ]),
        ]),

        h("div", { class: mainContainer }, [
          h("div", { class: mainInner }, [
            props.withSidebar
              ? h("aside", { class: sidebarStyle }, [
                  h(
                    RouterLink,
                    { to: "/dashboard", class: sidebarItem("/dashboard") },
                    () => "Overview",
                  ),
                  h(
                    RouterLink,
                    { to: "/analytics", class: sidebarItem("/analytics") },
                    () => "Analytics",
                  ),
                  h(
                    RouterLink,
                    { to: "/users", class: sidebarItem("/users") },
                    () => "Users",
                  ),
                ])
              : null,

            h("main", { class: contentStyle }, slots.default?.()),
          ]),
        ]),
      ]);
    };
  },
});
