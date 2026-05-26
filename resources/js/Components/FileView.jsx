import React, { useState, useEffect } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import {
  TrashIcon,
  DocumentPlusIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
export default function FileView({ className }) {
  const [fileList, setFileList] = useState([]);
  const [batchList, setBatchList] = useState([]);
  useEffect(() => {
    axios
      .get('/view-uploaded-data')
      .then(res => {
        setFileList(res.data.files);
        setBatchList(res.data.batches);
      })
      .catch(() => {});
  }, []);

  return (
    <div
      className={classNames(className, 'flex w-full rounded-lg bg-gray-200')}
    >
      <div className="flex w-full flex-col">
        <div className="flex">
          {fileList == undefined || fileList.length == 0 ? (
            <div className="flex h-fit w-full flex-col">
              <h5 className="mb-3 text-lg font-bold text-black">No Files</h5>
            </div>
          ) : (
            <div className="flex h-fit w-full flex-col">
              <h5 className="mb-3 text-lg font-bold text-black">
                Validated Files
              </h5>
              <ul className="list-inside">
                {fileList.map(f => (
                  <li
                    className="text-base leading-relaxed text-black"
                    key={f.name}
                  >
                    <div className="flex w-full justify-between">
                      <div className="flex">
                        <button>
                          <DocumentPlusIcon
                            aria-hidden="true"
                            className="flex inline-block size-5 shrink-0 align-middle"
                          />
                        </button>
                        {f.name}
                      </div>
                      <button>
                        <TrashIcon
                          aria-hidden="true"
                          className="flex inline-block size-5 shrink-0 align-middle"
                        />
                      </button>
                    </div>
                    <hr className="my-2 flex h-[2px] w-full border-0 bg-gray-300"></hr>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex"></div>
        {batchList == undefined || batchList.length == 0 ? (
          <div className="flex h-fit w-full flex-col">
            <h5 className="mb-3 text-lg font-bold text-black">No Batches</h5>
          </div>
        ) : (
          <div className="flex h-fit w-full flex-col">
            <h5 className="mb-3 text-lg font-bold text-black">
              Created Batches
            </h5>
            <ul className="list-inside">
              {batchList.map(b => (
                <li
                  className="text-base leading-relaxed text-black"
                  key={b.name}
                >
                  <div className="flex w-full justify-between">
                    <div className="flex">
                      <button>
                        <DocumentDuplicateIcon
                          aria-hidden="true"
                          className="flex inline-block size-5 shrink-0 align-middle"
                        />
                      </button>
                      {b.name}
                    </div>
                    <button>
                      <TrashIcon
                        aria-hidden="true"
                        className="flex inline-block size-5 shrink-0 align-middle"
                      />
                    </button>
                  </div>
                  <hr className="my-2 flex h-[2px] w-full border-0 bg-gray-300"></hr>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
