import { notification } from 'antd';

const openNotificationWithIcon = (type: string, message: string, err: string) => {
    if(type == 'success' || type == 'warning' || type == 'error')
        notification[type]({ message: message, description: err});
    return;
};

export default openNotificationWithIcon;