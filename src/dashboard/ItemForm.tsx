import { faSave } from "@fortawesome/free-solid-svg-icons";
import BreadCrumbs from "dashboard/components/BreadCrumbs";
import api from "dashboard/utils/api";
import FontAwesomeIcon from "dashboard/utils/FontAwesomeIcon";
import useForm, { FormValues } from "dashboard/utils/useForm";
import * as Preact from "preact";
import { Link } from "react-router-dom";

export default function ItemForm<T extends Record<string, any>>({
  path,
  singular,
  plural,
  defaultValue,
  children,
}: {
  singular: string;
  plural: string;
  path: string;
  defaultValue?: Partial<T>;
  children: (form: FormValues<Partial<T>>) => Preact.JSX.Element;
}) {
  const form = useForm<Partial<T>>(defaultValue);
  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await api.post(path, form.values);
    console.log(result);
  };
  const label = `New ${singular}`;
  return (
    <form onSubmit={onSubmit}>
      <header>
        <div>
          <BreadCrumbs
            path={[
              {
                to: path,
                label: plural,
              },
              {
                label,
              },
            ]}
          />
          <h1>{label}</h1>
        </div>
        <div class="buttons">
          <Link to={path} className="button-secondary" type="cancel">
            Cancel
          </Link>
          <button class="button-primary" type="submit">
            <FontAwesomeIcon icon={faSave} />
            Save
          </button>
        </div>
      </header>
      {children(form)}
    </form>
  );
}