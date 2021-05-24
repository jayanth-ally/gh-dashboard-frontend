import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const HtmlTooltip = withStyles((theme) => ({
    arrow:{
        "&:before": {
            border: "1px solid #dadde9"
        },
        color:'#0099e5',
    },
    tooltip: {
      backgroundColor: '#0099e5',
      color: 'white',
      maxWidth: 250,
      fontSize: theme.typography.pxToRem(13),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);

export default HtmlTooltip;