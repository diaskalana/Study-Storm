
import React, { useEffect, useRef, useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';

import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';  
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

import customStyles from '../styles/fileUploadStyles.module.css';
import { FileIconList } from '../data';

export default function FormUploadArea({multiple = false, accept = "image/*", maxFileSize = 1000000, label, selectfunc = () => {}}) {

    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);
    
    
    const onSelect = (e) => {
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
        selectfunc(files);
    };

    const getFileType = (type) => {
        return FileIconList.find(file => type.includes(file.name))?.src || "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png";
    }

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onClear = () => {
        setTotalSize(0);
    };

    const itemTemplate = (file, props) => {
        return (
            <>
                <div className={`flex align-items-center flex-wrap`}>
                    <div className="flex align-items-center" style={{ width: '55%' }}>
                        <img alt={file.name} role="presentation" src={accept == "image/*" ? file.objectURL : getFileType(file.name.split('.')[1])} width={100} />
                        <span className="flex flex-column text-left ml-3">
                            {file.name}
                            <small>{new Date().toLocaleDateString()}</small>
                        </span>
                    </div>
                    <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                    <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
                </div>
            </>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column cursor-pointer" onClick={() => document.querySelector('.custom-choose-btn').click()}>
                <i className="pi pi-image mt-2 p-3" style={{ fontSize: '3em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span style={{ fontSize: '1em', color: 'var(--text-color-secondary)' }} className="my-3">
                    Drag and Drop {label} Here
                </span>
            </div>
        );
    };

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined hidden' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: `custom-cancel-btn p-button-danger p-button-rounded p-button-outlined ${multiple ? '' : 'hidden'}`};

    return (
        <div>

            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

            <FileUpload ref={fileUploadRef} name="fileupload[]" multiple={multiple} accept={accept} maxFileSize={maxFileSize}
                onSelect={onSelect} onError={onClear} onClear={onClear}
                itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                uploadOptions={uploadOptions} chooseOptions={chooseOptions} cancelOptions={cancelOptions} />
        </div>
    )
}
        