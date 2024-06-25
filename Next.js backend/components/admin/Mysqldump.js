import React from 'react'
import axios from "axios";
import fileDownload from 'js-file-download'

export const Mysqldump = () => {

    const getDb = async () => {
        try {
            const { data } = await axios.get('/api/v1/admin/downlaod/db', { responseType: 'blob' })

            fileDownload(data, `dump${new Date().toISOString().substring(0, 10).replace(/:/g, '-')}.sql`)
        } catch (error) {
            throw error
        }
    }

    return (
        <button className='btn btn-success btn-lg my-5 mx-5' onClick={getDb}>Download</button>
    )
}
export default Mysqldump