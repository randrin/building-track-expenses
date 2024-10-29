import AppLoader from "@crema/components/AppLoader";
import { authorizationUrl, initialUrl } from "@crema/constants/AppConst";
import { useAuthUser } from "@crema/hooks/AuthHooks";
import { ProjectType } from "@crema/types/models/dashboards/ProjectType";
import Router, { useRouter } from "next/router";
import { useEffect } from "react";
import { UserStatusEnums } from "utils/common-constants.utils";
import { TAM_SIGNIN_URL } from "utils/end-points.utils";

// eslint-disable-next-line react/display-name
const withData = (ComposedComponent: any) => (props: any) => {
  // States
  const { user, isLoading, projects } = useAuthUser();
  const { asPath, query } = useRouter();
  const queryParams = asPath.split("?")[1];

  console.log(user);
  console.log(projects);

  // Init
  useEffect(() => {
    if (user) {
      if (
        user.status === UserStatusEnums.ACTIVE &&
        checkProjects(
          projects?.filter(
            (project) => project.status === UserStatusEnums.ACTIVE
          )
        )
      ) {
        Router.push(initialUrl + (queryParams ? "?" + queryParams : ""));
      } else if (
        user.status !== UserStatusEnums.ACTIVE ||
        projects.length > 1
      ) {
        Router.push(authorizationUrl);
      } else {
        Router.push(initialUrl + (queryParams ? "?" + queryParams : ""));
      }
    } else {
      Router.push(TAM_SIGNIN_URL);
    }
  }, [queryParams, user, projects]);

  // Functions
  const checkProjects = (projects: ProjectType[]) => {
    if (projects.length === 1) {
      return projects[0].status === UserStatusEnums.ACTIVE ? true : false;
    } else false;
  };

  if (isLoading) return <AppLoader />;
  if (user) return <AppLoader />;

  // Render
  return <ComposedComponent {...props} />;
};

export default withData;
