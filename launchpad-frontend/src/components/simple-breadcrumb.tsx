import { Breadcrumbs, Anchor, Box } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export const SimpleBreadcrumb = ({
  items,
}: {
  items: { label: string; to: string }[];
}) => {
  const navigate = useNavigate();

  const crumbs = items.map((item, index) => (
    <Anchor
      key={index}
      onClick={(e) => {
        e.preventDefault();
        navigate(item.to);
      }}
      size="lg"
    >
      {item.label}
    </Anchor>
  ));

  return (
    <Box mb="sm">
      <Breadcrumbs>{crumbs}</Breadcrumbs>
    </Box>
  );
};
