import { useSearchParams } from "react-router-dom";
import { Select } from "../components";

const Sort = ({ options }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get("sortBy");

  const getOption = () => {
    for (const option of options) {
      const found = option.options.find((opt) => opt.value === searchParam);
      if (found) return found;
    }
    return options[0].options[0];
  };

  const sortBy = getOption();

  const handleChange = (option) => {
    searchParams.set("sortBy", option.value);
    searchParams.delete("page");
    setSearchParams(searchParams, { replace: true });
  };

  return <Select options={options} value={sortBy} onChange={handleChange} />;
};
export default Sort;
