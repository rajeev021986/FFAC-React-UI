import WarningIcon from '@mui/icons-material/Warning';
import toast from 'react-hot-toast';

export function ToastMessage({ message }) {
    toast.custom(() => (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 15px',
                color: '#721c24',
                borderRadius: '5px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
        >
            <WarningIcon />
            <span>{message}</span>
        </div>
    ));
};