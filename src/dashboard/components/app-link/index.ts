import { redirect } from "dashboard/utils/router";

export default class AppLink extends HTMLElement {
  private link: HTMLAnchorElement;
  connectedCallback() {
    this.link = document.createElement("a");
    const to = this.getAttribute("to") || this.getAttribute("href");
    this.link.setAttribute("href", to);
    this.childNodes.forEach((node) => {
      this.link.append(node);
    });
    this.appendChild(this.link);
    this.link.onclick = (e) => {
      e.preventDefault();
      to && redirect(to);
    };
  }

  static _example = {
    parameters: {
      to: "/some/path",
    },
    content: "Link anchor",
  };
}
