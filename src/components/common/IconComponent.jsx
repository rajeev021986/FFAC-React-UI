import * as MuiIcons from "@mui/icons-material";

const IconComponent = ({ iconName, ...props }) => {
  const Icon = MuiIcons[iconName];

  if (!Icon) return <MuiIcons.FormatListBulletedOutlined/>;

  return <Icon {...props} />;
};

export default IconComponent;
