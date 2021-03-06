import { icon } from "@fortawesome/fontawesome-svg-core";
import { faCog, faCopy } from "@fortawesome/free-solid-svg-icons";
import { html } from "amp/lib";
import { Containers } from "dashboard/types";
import styles from "./styles.scss";

const GRID_TEMPLATE_COLUMNS = "12rem 1fr 24rem";
const MIN_COLUMN = 12;

const state: Partial<Containers> = {};
export default (
  container: HTMLElement,
  redraw: boolean = false
): Containers => {
  if (!redraw && state.main && state.parameters && state.sidebar)
    return state as Containers;
  container.innerHTML = html`
    <div
      class="${styles.wrapper}"
      style="grid-template-columns:${GRID_TEMPLATE_COLUMNS}"
    >
      <aside class="${styles.sidebar}">
        <div class="${styles.drawer}">
          <nav class="${styles.icons}">
            <ul>
              <li class="${styles.active}">${icon(faCopy).html}</li>
              <li>${icon(faCog).html}</li>
            </ul>
            <app-logo class="${styles["vertical-logo"]}" vertical></app-logo>
          </nav>
          <nav class="${styles.tree}">
            <app-menu></app-menu>
          </nav>
        </div>
        <div class="${styles.splitter}" style="right:0"></div>
      </aside>
      <main class="${styles.main}"></main>
      <aside class="${styles.parameters}">
        <div class="${styles.splitter}" style="left:0"></div>
        <section></section>
      </aside>
    </div>
  `;

  const wrapper = container.querySelector(`.${styles.wrapper}`);
  state.main = container.querySelector("main");
  state.sidebar = container.querySelector(`.${styles.sidebar}`) as HTMLElement;
  state.parameters = container.querySelector(
    `.${styles.parameters}>section`
  ) as HTMLElement;
  container
    .querySelectorAll(`.${styles.splitter}`)
    .forEach((element: HTMLElement, i: number) =>
      setupSplitter(element, wrapper as HTMLElement, i === 0, () =>
        state.main.dispatchEvent(new CustomEvent("resize"))
      )
    );
  return state as Containers;
};

const setupSplitter = (
  handler: HTMLElement,
  element: HTMLElement,
  left: boolean,
  onResize: () => void
) => {
  const state = {
    isDragging: false,
  };

  const onDrag = (e: MouseEvent | TouchEvent) => {
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    const sizes = element.style.gridTemplateColumns.split(" ");
    if (left) sizes[0] = Math.max(x, MIN_COLUMN) + "px";
    else sizes[2] = Math.max(element.clientWidth - x, MIN_COLUMN) + "px";
    element.style.gridTemplateColumns = sizes.join(" ");
    onResize();
  };

  const onDragEvent = (started: boolean) => () => {
    state.isDragging = started;
    element.classList[started ? "add" : "remove"](styles.resizing);
    const action = started ? "addEventListener" : "removeEventListener";
    ["mouseup", "touchend", "touchcancel", "mouseleave"].forEach((event) =>
      window[action](event, onDragStop)
    );
    ["mousemove", "touchmove"].forEach((event) =>
      window[action](event, onDrag, { passive: true })
    );
  };

  const onDragStart = onDragEvent(true);
  const onDragStop = onDragEvent(false);

  handler.draggable = false;
  handler.addEventListener("mousedown", onDragStart);
  handler.addEventListener("touchstart", onDragStart, { passive: true });
};
