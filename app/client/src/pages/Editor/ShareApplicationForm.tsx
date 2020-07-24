import React, { useEffect } from "react";
import styled from "styled-components";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { AppState } from "reducers";
import { StyledSwitch } from "components/propertyControls/StyledControls";
import { fetchApplication } from "actions/applicationActions";
import Spinner from "@appsmith/components/ads/Spinner";
import { ReduxActionTypes } from "constants/ReduxActionConstants";

const ShareWithPublicOption = styled.div`
   {
    display: flex;
    padding-top: 20px;
    justify-content: space-between;
  }
`;

const ShareToggle = styled.div`
   {
    &&& label {
      margin-bottom: 0px;
    }
    &&& div {
      margin-right: 5px;
    }
    display: flex;
  }
`;

export const ShareApplicationForm = (props: any) => {
  const {
    match: {
      params: { applicationId },
    },
    fetchApplication,
    isFetchingApplication,
    isChangingViewAccess,
    currentApplicationDetails,
    changeAppViewAccess,
  } = props;

  useEffect(() => {
    fetchApplication(applicationId);
  }, [fetchApplication, applicationId]);

  return (
    <ShareWithPublicOption>
      Share the application with anyone
      <ShareToggle>
        {(isChangingViewAccess || isFetchingApplication) && (
          <Spinner size={20} />
        )}
        {currentApplicationDetails && (
          <StyledSwitch
            onChange={() => {
              changeAppViewAccess(
                applicationId,
                !currentApplicationDetails.isPublic,
              );
            }}
            disabled={isChangingViewAccess || isFetchingApplication}
            checked={currentApplicationDetails.isPublic}
            large
          />
        )}
      </ShareToggle>
    </ShareWithPublicOption>
  );
};

const mapStateToProps = (state: AppState) => ({
  currentApplicationDetails: state.ui.applications.currentApplication,
  isFetchingApplication: state.ui.applications.isFetchingApplication,
  isChangingViewAccess: state.ui.applications.isChangingViewAccess,
});

const mapDispatchToProps = (dispatch: any) => ({
  fetchApplication: (applicationId: string) => {
    return dispatch(fetchApplication(applicationId));
  },
  changeAppViewAccess: (applicationId: string, publicAccess: boolean) =>
    dispatch({
      type: ReduxActionTypes.CHANGE_APPVIEW_ACCESS_INIT,
      payload: {
        applicationId,
        publicAccess,
      },
    }),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ShareApplicationForm),
);