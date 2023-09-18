# vue-merge-link

See documentation at https://merge.dev/docs/linking-flow/get-started.

When updating this repo, bump the version number in `package.json` according to this semantic versioning scheme: https://docs.npmjs.com/about-semantic-versioning

---

### Frequently Asked Questions (FAQ)

#### **Q: What version of Vue do you support?**
**A:** The latest version of this package requires Vue version 3.0+. If you need support for an older version of Vue, you can use an older version of this package (1.1). Note that these packages are not supported and older versions of Vue have been [deprecated](https://vuejs.org/about/faq.html#is-vue-2-still-supported).

#### **Q: What domains are necessary to whitelist for Content Security Policies (CSP)?**
**A:** You can see the domains required for whitelisting in this [help center](https://help.merge.dev/en/articles/5924787-using-content-security-policy-csp-with-merge) article. 

#### **Q: My Vue component appears to be correctly set up, but when I click a button, nothing happens, no network calls are made, and scrolling is locked up as if a modal had opened. How can I fix this?**
**A:** This behavior might occur if a child component attempts to render or perform operations before its parent component is fully mounted and ready. In such cases, it's important to ensure the child component is rendered only after the parent component is fully ready.
A common solution to this problem is to use the `v-if` directive to delay the mounting of the child component until the parent component is fully created and mounted. 

---
