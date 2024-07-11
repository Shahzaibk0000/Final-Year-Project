import Routes from "./routes";
import CustomTheme from "./themes";
import ScrollTop from "@components/ScrollTop";
import { UserProvider } from "./context/UserContext";

const App = () => (
  <CustomTheme>
    <ScrollTop>
      <UserProvider>
        <Routes />
      </UserProvider>
    </ScrollTop>
  </CustomTheme>
);

export default App;
