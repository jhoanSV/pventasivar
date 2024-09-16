import ReactDOM from 'react-dom/client';
import { AlertContent } from './AlertContent';
import React from 'react';

export const TheAlert = (message, mode = 0) => {

    return new Promise((resolve) => {
        document.body.classList.add('modalOpen');
        
        const theRoot = document.getElementById('root');
        const div = document.createElement('div');
        theRoot.appendChild(div);
    
        const root = ReactDOM.createRoot(div);
    
        const closeAlert = () => {
            document.getElementById('talertcId').classList.add('bye');
            setTimeout(() => {
                document.body.classList.remove('modalOpen');
                root.unmount();
                theRoot.removeChild(div);
            }, 200);
        }
    
        const handleCancel = () => {
            closeAlert();
            resolve(false);
        };
    
        const handleAccept = () => {
            closeAlert();
            resolve(true);
        };
    
        root.render(
            <AlertContent
                message={message}
                mode={mode}
                onCancel={handleCancel}
                onAccept={handleAccept}
            />
        );
    });
};