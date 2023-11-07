"use client";

import {
  MultiFileDropzone,
  type FileState,
} from "@/components/multi-file-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { useState } from "react";
import { toast } from "react-toastify";


export default function Page() {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const { edgestore } = useEdgeStore();
  const [agreed, setAgreed] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupTag, setGroupTag] = useState("");

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  const uploadFile = async (url: string) => {
    try {
      await edgestore.myProtectedFiles.confirmUpload({ url });
      return { success: true, url };
    } catch (error) {
      return { success: false, url, error };
    }
  };

  const handleFileUpload = async () => {
    if (urls.length === 0) {
      toast.error("No files to upload");
      return;
    }
    if (!groupName && !groupDescription && !groupTag) {
      toast.error("Please fill all the fields");
      return;
    }
    const results = await Promise.all(urls.map((url) => uploadFile(url)));

    results.forEach((result) => {
      if (result.success) {
        toast.success(`File uploaded successfully`);
        setUrls([]);
        setFileStates([]);
      } else {
        toast.error(`Failed to upload file`);
      }
    });
  };

  const handleCancel = async () => {
    if (urls.length === 0) {
      return;
    }
    setFileStates([]);
    setUrls([]);
    toast.warn("Cancelled");
  };

  return (
    <>
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Upload multiple files at once
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              The only limit is your imagination.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
            <div className="p-8 sm:p-10 lg:flex-auto">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                Get started
              </h3>
              <div className="mt-10 flex items-center gap-x-4">
                <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">
                  What’s included
                </h4>
                <div className="h-px flex-auto bg-gray-100" />
              </div>
              <ul
                role="list"
                className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
              >
                <li className="flex gap-x-3">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Group name
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">@</span>
                      </div>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Name"
                        onChange={(e) => setGroupName(e.target.value)}
                      />
                    </div>
                  </div>
                </li>
                <li className="flex gap-x-3">
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Group Description
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">@</span>
                      </div>
                      <input
                        type="text"
                        name="description"
                        id="description"
                        className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Description"
                        onChange={(e) => setGroupDescription(e.target.value)}
                      />
                    </div>
                  </div>
                </li>
                <li className="flex gap-x-3">
                  <div>
                    <label
                      htmlFor="Tag"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Group Tag
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">@</span>
                      </div>
                      <input
                        type="text"
                        name="Tag"
                        id="Tag"
                        className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Tag Name"
                        onChange={(e) => setGroupTag(e.target.value)}
                      />
                    </div>
                  </div>
                </li>
              </ul>
              <a
                href="#"
                onClick={()=>handleFileUpload()}
                className="mt-10 block w-24 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                save
              </a>
            </div>
            <div className="lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-1">
              <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                <div className="mx-auto max-w-xs px-8">
                  <MultiFileDropzone
                    className="w-full"
                    value={fileStates}
                    onChange={(files) => {
                      setFileStates(files);
                    }}
                    onFilesAdded={async (addedFiles) => {
                      setFileStates([...fileStates, ...addedFiles]);
                      await Promise.all(
                        addedFiles.map(async (addedFileState) => {
                          try {
                            const res = await edgestore.myProtectedFiles.upload(
                              {
                                file: addedFileState.file,
                                options: {
                                  temporary: true,
                                },
                                onProgressChange: async (progress) => {
                                  updateFileProgress(
                                    addedFileState.key,
                                    progress
                                  );

                                  if (progress === 100) {
                                    await new Promise((resolve) =>
                                      setTimeout(resolve, 1000)
                                    );
                                    updateFileProgress(
                                      addedFileState.key,
                                      "COMPLETE"
                                    );
                                  }
                                },
                              }
                            );
                            setUrls((prev) => [...prev, res.url]);
                          } catch (err) {
                            updateFileProgress(addedFileState.key, "ERROR");
                          }
                        })
                      );
                    }}
                  />
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex flex-row justify-center gap-6 items-center border-2 p-5">
              <MultiFileDropzone
                className=""
                value={fileStates}
                onChange={(files) => {
                  setFileStates(files);
                }}
                onFilesAdded={async (addedFiles) => {
                  setFileStates([...fileStates, ...addedFiles]);
                  await Promise.all(
                    addedFiles.map(async (addedFileState) => {
                      try {
                        const res = await edgestore.myProtectedFiles.upload({
                          file: addedFileState.file,
                          options: {
                            temporary: true,
                          },
                          onProgressChange: async (progress) => {
                            updateFileProgress(addedFileState.key, progress);

                            if (progress === 100) {
                              await new Promise((resolve) =>
                                setTimeout(resolve, 1000)
                              );
                              updateFileProgress(
                                addedFileState.key,
                                "COMPLETE"
                              );
                            }
                          },
                        });
                        setUrls((prev) => [...prev, res.url]);
                      } catch (err) {
                        updateFileProgress(addedFileState.key, "ERROR");
                      }
                    })
                  );
                }}
              />

              <div className="flex flex-col gap-2">
                <div>Name</div>
                <TextField />
                <div>Description</div>
                <TextField />
                <div>Tags</div>
                <TextField />
                <div className="flex justify-end mt-2 gap-2">
                  <button
                    className="bg-white text-black rounded px-3 py-1 hover:opacity-80"
                    onClick={() => {
                      handleCancel();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-white text-black rounded px-3 py-1 hover:opacity-80"
                    onClick={() => {
                      handleFileUpload();
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div> */}
    </>
  );
}

function TextField(props: {
  name?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <input
      type="text"
      name={props.name}
      className="bg-zinc-900 border border-zinc-600 rounded px-2 py-1"
      onChange={(e) => props.onChange?.(e.target.value)}
    />
  );
}
