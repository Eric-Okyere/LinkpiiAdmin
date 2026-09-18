import { BeatLoader } from 'react-spinners';

const Loader = ({ height = 'h-64' }) => (
  <div className={`flex w-full items-center justify-center ${height}`}>
    <BeatLoader color="#ab6c0f" />
  </div>
);

export default Loader;
