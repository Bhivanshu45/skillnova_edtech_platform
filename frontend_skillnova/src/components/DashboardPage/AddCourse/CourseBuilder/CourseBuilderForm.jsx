import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { IoAddCircleOutline } from "react-icons/io5"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import { createSection,updateSection } from "../../../../services/operations/courseDetailAPI"
import { setCourse,setEditCourse,setStep } from "../../../../slices/courseSlice"
import IconBtn from "../../../Common/IconBtn"
import NestedView from "./NestedView"

export default function CourseBuilderForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [editSectionName, setEditSectionName] = useState(null)
  const dispatch = useDispatch()

  // handle form submission
  const onSubmit = async (data) => {
    setLoading(true)

    let result;
    
    // console.log("Data to edit section : ",data)
    if (editSectionName) {
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        },
        token
      )
      // console.log("edit section result : ", result)
    } else {
      // console.log("Course ID : ",course?._id)
      result = await createSection(
        {
          sectionName: data.sectionName,
          courseId: course?._id,
        },
        token
      )
      // console.log("result" ,result)
    }
    if (result) {
      dispatch(setCourse({ ...result }))
      setEditSectionName(null)
      setValue("sectionName", "")
    }
    setLoading(false)
  }
  // updateSection
  const cancelEdit = () => {
    setEditSectionName(null)
    setValue("sectionName", "")
  }

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    // console.log(editSectionName, sectionId, sectionName);
    if (editSectionName === sectionId) {
      cancelEdit()
      return
    }
    setEditSectionName(sectionId)
    setValue("sectionName", sectionName)
  }

  const goToNext = () => {
    if (!Array.isArray(course?.courseContent)) {
      toast.error("Course content is missing")
      return
    }
  
    if (course.courseContent?.length === 0) {
      toast.error("Please add at least one section")
      return
    }
  
    if (course?.courseContent.some((section) => !Array.isArray(section?.subSection) || section?.subSection?.length === 0)) {
      toast.error("Please add at least one lecture in each section")
      return
    }
  
    dispatch(setStep(3))
  }
  // console.log("course:", course);
   // console.log("courseContent:", course?.courseContent);

  const goBack = () => {
    dispatch(setStep(1))
    dispatch(setEditCourse(true))
  
  }

  return (
    <div className="space-y-8 rounded-md border-[1px] text-white border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold">Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm" htmlFor="sectionName">
            Section Name <sup className="text-red-600">*</sup>
          </label>
          <input
            id="sectionName"
            disabled={loading}
            placeholder="Add a section to build your course"
            {...register("sectionName", { required: true })}
            className="form-style w-full bg-slate-900 rounded-md text-white border border-1 border-gray-300 p-2"
          />
          {errors.sectionName && (
            <span className="ml-2 text-xs tracking-wide text-red-600">
              Section name is required
            </span>
          )}
        </div>
        <div className="flex items-end gap-x-4">
          <IconBtn
            type="submit"
            disabled={loading}
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline={true}
          >
            <IoAddCircleOutline size={20} />
          </IconBtn>
          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
      {course.courseContent?.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}
      {/* Next Prev Button */}
      <div className="flex justify-end gap-x-3">
        <button
          onClick={goBack}
          className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
        >
          Back
        </button>
        <IconBtn disabled={loading} text="Next" onclick={goToNext}>
          <MdNavigateNext />
        </IconBtn>
      </div>
    </div>
  )
}