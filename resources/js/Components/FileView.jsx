import React, { useState, useEffect } from 'react';
import { XCircleIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import {
  TrashIcon,
  DocumentPlusIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
export default function FileView({ className }) {
  const [fileList, setFileList] = useState([]);
  const [batchList, setBatchList] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    axios
      .get('/view-uploaded-data')
      .then(res => {
        setFileList(res.data.files);
        console.log(JSON.stringify(res.data.files));
        setBatchList(res.data.batches);
        console.log(JSON.stringify(res.data.batches));
      })
      .catch(err => {
        setError(JSON.stringify(err));
      });
  }, []);

  return (
    <div
      className={classNames(className, 'flex w-full rounded-lg bg-gray-200')}
    >
      <div className="flex flex-col w-full">
        <div className="flex">
          {fileList == undefined || fileList.length == 0 ? (
            <div className="flex w-full flex-col h-fit">
              <h5 className="mb-3 text-lg font-bold text-black">No Files</h5>
            </div>
          ) : (
            <div className="flex w-full flex-col h-fit">
              <h5 className="mb-3 text-lg font-bold text-black">
                Validated Files
              </h5>
              <ul className="list-inside">
                {fileList.map(f => (
                  <li
                    className="text-base leading-relaxed text-black"
                    key={f.name}
                  >
                    <div className="flex justify-between w-full">
                      <div className="flex">
                        <button>
                          <DocumentPlusIcon
                            aria-hidden="true"
                            className="flex inline-block align-middle size-5 shrink-0"
                          />
                        </button>
                        {f.name}
                      </div>
                      <button>
                        <TrashIcon
                          aria-hidden="true"
                          className="flex inline-block align-middle size-5 shrink-0"
                        />
                      </button>
                    </div>
                    <hr className="flex h-[2px] my-2 bg-gray-300 w-full border-0"></hr>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex"></div>
        {batchList == undefined || batchList.length == 0 ? (
          <div className="flex w-full flex-col h-fit">
            <h5 className="mb-3 text-lg font-bold text-black">No Batches</h5>
          </div>
        ) : (
          <div className="flex w-full flex-col h-fit">
            <h5 className="mb-3 text-lg font-bold text-black">
              Created Batches
            </h5>
            <ul className="list-inside">
              {batchList.map(b => (
                <li
                  className="text-base leading-relaxed text-black"
                  key={b.name}
                >
                  <div className="flex justify-between w-full">
                    <div className="flex">
                      <button>
                        <DocumentDuplicateIcon
                          aria-hidden="true"
                          className="flex inline-block align-middle size-5 shrink-0"
                        />
                      </button>
                      {b.name}
                    </div>
                    <button>
                      <TrashIcon
                        aria-hidden="true"
                        className="flex inline-block align-middle size-5 shrink-0"
                      />
                    </button>
                  </div>
                  <hr className="flex h-[2px] my-2 bg-gray-300 w-full border-0"></hr>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
