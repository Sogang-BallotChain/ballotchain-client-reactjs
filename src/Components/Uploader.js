import React from 'react'
import { Upload, Icon, message } from 'antd';
import readXlsxFile from 'read-excel-file'
const { Dragger } = Upload;

class Uploader extends React.Component {

    render() {
        const onUploadSuccess = this.props.onUploadSuccess
        const uploader_props = {
            name: 'file',
            action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            multiple: false,
            onChange(info) {
              const { status } = info.file;
              
              if (status !== 'uploading') {
                
              }
              if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);

                /* Read excel file */
                readXlsxFile(info.file.originFileObj)
                  .then(onUploadSuccess)
                  .catch(console.log)
              } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
              }
            },
        };
        return (
            <Dragger {...uploader_props}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text"> 엑셀 파일을 업로드하여 유권자를 추가할 수 있습니다! </p>
            <p className="ant-upload-hint">
              유권자를 추가하지 않을 경우, 모든 사용자가 귀하의 투표에 참여할 수 있습니다.
            </p>
          </Dragger>
        )
    }
}


export default Uploader