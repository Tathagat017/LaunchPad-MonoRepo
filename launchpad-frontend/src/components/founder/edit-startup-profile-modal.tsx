import React, { useReducer, useState } from "react";
import {
  Modal,
  Textarea,
  Button,
  Group,
  Select,
  Stack,
  Text,
  Anchor,
  ActionIcon,
} from "@mantine/core";

import { useStore } from "../../hooks/use-store";
import { notifications } from "@mantine/notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

import { StartUpProfile } from "../../types/start-up-profile";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";

const initialState: StartUpProfile = {
  _id: "",
  CompanyVision: "",
  ProductDescription: "",
  MarketSize: "small",
  BusinessModel: "",
  pitchPdf: "",
};

type Action =
  | { type: "SET_PROFILE"; payload: StartUpProfile }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: "UPDATE_FIELD"; payload: { key: keyof StartUpProfile; value: any } }
  | { type: "RESET" };

function reducer(state: StartUpProfile, action: Action): StartUpProfile {
  switch (action.type) {
    case "SET_PROFILE":
      return action.payload;
    case "UPDATE_FIELD":
      return { ...state, [action.payload.key]: action.payload.value };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const EditStartUpProfileModal = observer(function EditStartUpProfileModal() {
  const { founderStore, uiViewStore } = useStore();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [editable, setEditable] = useState(false);

  const { isLoading } = useQuery({
    queryKey: ["startup-profile"],
    queryFn: async () => {
      const result = await founderStore.getProfile();
      return result;
    },
    onSuccess: (data) => {
      if (!data) return;
      dispatch({ type: "SET_PROFILE", payload: data });
    },
    enabled: uiViewStore.EditStartUpProfileModal,
    refetchOnMount: true,
  });

  const handleClose = () => {
    dispatch({ type: "RESET" });
    setEditable(false);
    uiViewStore.toggleEditStartUpProfile(false);
  };

  const handleSave = async () => {
    const success = await founderStore.updateProfile(state);
    if (success) {
      notifications.show({
        title: "Success",
        message: "Startup profile updated successfully.",
        color: "green",
      });
      handleClose();
    } else {
      notifications.show({
        title: "Error",
        message: "Failed to update startup profile.",
        color: "red",
      });
    }
  };

  return (
    <Modal
      opened={uiViewStore.EditStartUpProfileModal}
      onClose={handleClose}
      title={
        <Group position="apart" style={{ width: "100%" }}>
          <Text size="lg" weight={500}>
            Edit Startup Profile
          </Text>
          <ActionIcon
            variant="light"
            onClick={() => setEditable((prev) => !prev)}
            aria-label="Edit"
          >
            <FontAwesomeIcon icon={faPen} />
          </ActionIcon>
        </Group>
      }
      size="lg"
      overlayProps={{ blur: 3 }}
    >
      <Stack spacing="sm">
        <Textarea
          label="Company Vision"
          value={state.CompanyVision}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_FIELD",
              payload: { key: "CompanyVision", value: e.currentTarget.value },
            })
          }
          disabled={!editable}
        />
        <Textarea
          label="Product Description"
          value={state.ProductDescription}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_FIELD",
              payload: {
                key: "ProductDescription",
                value: e.currentTarget.value,
              },
            })
          }
          disabled={!editable}
        />
        <Select
          label="Market Size"
          data={["Small", "Medium", "Large"]}
          value={state.MarketSize}
          onChange={(value) =>
            dispatch({
              type: "UPDATE_FIELD",
              payload: { key: "MarketSize", value },
            })
          }
          disabled={!editable}
        />
        <Textarea
          label="Business Model"
          value={state.BusinessModel}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_FIELD",
              payload: { key: "BusinessModel", value: e.currentTarget.value },
            })
          }
          disabled={!editable}
        />
        {state.pitchPdf && (
          <Anchor
            href={state.pitchPdf}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Uploaded Pitch PDF
          </Anchor>
        )}

        {editable && (
          <Group position="right" mt="md">
            <Button onClick={handleSave} loading={isLoading}>
              Save
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </Group>
        )}
      </Stack>
    </Modal>
  );
});

export default EditStartUpProfileModal;
