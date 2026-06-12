"use client";

import React, { useState } from "react";
import {
    Form,
    Fieldset,
    TextField,
    Label,
    Input,
    TextArea,
    FieldError,
    Select,
    ListBox,
    Switch,
    Button,
    toast
} from "@heroui/react";
import { Briefcase, Globe } from "@gravity-ui/icons";
import { createJob } from "@/lib/actions/jobs";
import { redirect } from "next/navigation";

export default function PostJobForm({ company }) {
    const [isRemote, setIsRemote] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
  
    const [formState, setFormState] = useState({
        jobTitle: '',
        jobCategory: '',
        jobType: '',
        minSalary: '',
        maxSalary: '',
        currency: 'USD',
        location: '',
        deadline: '',
        responsibilities: '',
        requirements: '',
        benefits: ''
    });

    const handleInputChange = (field, value) => {
        setFormState(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newErrors = {};
        if (!formState.jobTitle) newErrors.jobTitle = "Job title is required";
        if (!formState.jobCategory) newErrors.jobCategory = "Job category is required";
        if (!formState.jobType) newErrors.jobType = "Job type is required";
        if (!formState.minSalary) newErrors.minSalary = "Minimum salary is required";
        if (!formState.maxSalary) newErrors.maxSalary = "Maximum salary is required";
        if (!isRemote && !formState.location) newErrors.location = "Location is required for non-remote roles";
        if (!formState.deadline) newErrors.deadline = "Application deadline is required";
        if (!formState.responsibilities) newErrors.responsibilities = "Responsibilities are required";
        if (!formState.requirements) newErrors.requirements = "Requirements are required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        setErrors({});

        const payload = {
            jobTitle: formState.jobTitle,
            jobCategory: formState.jobCategory,
            jobType: formState.jobType,
            minSalary: formState.minSalary,
            maxSalary: formState.maxSalary,
            currency: formState.currency,
            location: isRemote ? 'Remote' : formState.location,
            deadline: formState.deadline,
            responsibilities: formState.responsibilities,
            requirements: formState.requirements,
            benefits: formState.benefits,
            isRemote,
            companyId: company._id,
            companyName: company.name,
            companyLogo: company.logo,
            status: "active",
            isPubliclyVisible: true,
        };

        try {
            const res = await createJob(payload);

            if (res.insertedId) {
                toast.success("Job posted successfully!");
                setFormState({
                    jobTitle: '',
                    jobCategory: '',
                    jobType: '',
                    minSalary: '',
                    maxSalary: '',
                    currency: 'USD',
                    location: '',
                    deadline: '',
                    responsibilities: '',
                    requirements: '',
                    benefits: ''
                });
                setIsRemote(false);
                redirect("/dashboard/recruiter/jobs");
            } else {
                toast.error(res.message || "Failed to post job. Please try again.");
            }
        } catch (error) {
            console.error("Job posting error:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to get matching styles for company status badge
    const getStatusStyles = (status) => {
        const currentStatus = status || 'Pending';
        switch(currentStatus) {
            case 'Approved': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
            case 'Rejected': return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
            default: return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
        }
    };

    const textInputClass = "w-full text-white bg-[#1c1c1e] border border-zinc-800 hover:bg-[#242426] focus:border-zinc-600 rounded-lg h-12 px-3 text-sm placeholder:text-zinc-600 outline-none transition-all";
    const textAreaClass = "w-full text-white bg-[#1c1c1e] border border-zinc-800 hover:bg-[#242426] focus:border-zinc-600 rounded-lg p-3 text-sm placeholder:text-zinc-600 outline-none transition-all";

    const selectBoxClass = "w-full";
    const triggerClasses = "w-full flex items-center justify-between bg-[#1c1c1e] border border-zinc-800 hover:bg-[#242426] h-12 rounded-lg px-3 text-white transition-all text-sm outline-none data-[focused=true]:border-zinc-600 data-[invalid=true]:border-danger";
    const popoverClasses = "bg-[#1c1c1e] border border-zinc-800 text-white rounded-lg shadow-xl p-1";
    const listItemClasses = "flex items-center justify-between p-2 rounded-md hover:bg-zinc-800 cursor-pointer text-sm text-zinc-200 outline-none data-[focused=true]:bg-zinc-800";

    return (
        <div className="min-h-screen bg-[#0d0d0e] text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-[#121214] border border-zinc-900 rounded-xl p-8 shadow-2xl">

                {/* Form Header block */}
                <div className="border-b border-zinc-800 pb-6 mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight">Post a New Job</h1>
                    <p className="text-zinc-400 text-sm mt-1">
                        Fill out the details below to publish your open position.
                    </p>

                    {/* Dynamic Company verification status panel */}
                    <div className="mt-4 inline-flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-400">
                        <Briefcase size={14} className="text-zinc-500" />
                        Posting as: <span className="font-semibold text-zinc-300">{company.name}</span>
                        <span className={`px-2 py-0.5 rounded-full font-medium border text-[10px] uppercase tracking-wider ${getStatusStyles(company.status)}`}>
                            {company.status || 'Pending'}
                        </span>
                    </div>
                </div>

                {/* Styled warning card for Unapproved companies */}
                {company.status !== 'Approved' && (
                    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl p-6 text-center max-w-md mx-auto my-6 space-y-2">
                        <h3 className="font-semibold text-base">Verification Pending</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Your company profile must be approved before you can post jobs. Please wait while our administrators verify your workspace.
                        </p>
                    </div>
                )}

                {/* Hero UI Main Form Handler */}
                {company.status === 'Approved' && (
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* SECTION 1: Job Information */}
                        <Fieldset className="space-y-6 w-full">
                            <legend className="text-lg font-medium text-zinc-300 border-b border-zinc-900 w-full pb-2 mb-2">
                                Job Information
                            </legend>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <TextField name="jobTitle" isInvalid={!!errors.jobTitle} className="flex flex-col gap-1 w-full">
                                    <Label className="text-zinc-400 font-medium text-sm">Job Title</Label>
                                    <Input 
                                        placeholder="e.g. Senior Frontend Engineer" 
                                        className={textInputClass}
                                        value={formState.jobTitle}
                                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                                    />
                                    {errors.jobTitle && <FieldError className="text-xs text-danger mt-1">{errors.jobTitle}</FieldError>}
                                </TextField>

                                <div className="flex flex-col gap-1">
                                    <Label className="text-zinc-400 font-medium text-sm">Job Category</Label>
                                    <Select 
                                        className={selectBoxClass}
                                        isInvalid={!!errors.jobCategory}
                                        aria-label="Job Category"
                                        selectedKeys={formState.jobCategory ? [formState.jobCategory] : []}
                                        onSelectionChange={(keys) => {
                                            const value = Array.from(keys)[0];
                                            handleInputChange('jobCategory', value);
                                        }}
                                    >
                                        <Select.Trigger className={triggerClasses}>
                                            <Select.Value className="text-white placeholder:text-zinc-600" />
                                            <Select.Indicator />
                                        </Select.Trigger>
                                        {errors.jobCategory && <span className="text-xs text-danger mt-1">{errors.jobCategory}</span>}
                                        <Select.Popover className={popoverClasses}>
                                            <ListBox className="outline-none">
                                                <ListBox.Item id="technology" className={listItemClasses} textValue="Technology">Technology</ListBox.Item>
                                                <ListBox.Item id="design" className={listItemClasses} textValue="Design">Design</ListBox.Item>
                                                <ListBox.Item id="marketing" className={listItemClasses} textValue="Marketing">Marketing</ListBox.Item>
                                                <ListBox.Item id="sales" className={listItemClasses} textValue="Sales">Sales</ListBox.Item>
                                            </ListBox>
                                        </Select.Popover>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-1">
                                    <Label className="text-zinc-400 font-medium text-sm">Job Type</Label>
                                    <Select 
                                        className={selectBoxClass}
                                        isInvalid={!!errors.jobType}
                                        aria-label="Job Type"
                                        selectedKeys={formState.jobType ? [formState.jobType] : []}
                                        onSelectionChange={(keys) => {
                                            const value = Array.from(keys)[0];
                                            handleInputChange('jobType', value);
                                        }}
                                    >
                                        <Select.Trigger className={triggerClasses}>
                                            <Select.Value />
                                            <Select.Indicator />
                                        </Select.Trigger>
                                        {errors.jobType && <span className="text-xs text-danger mt-1">{errors.jobType}</span>}
                                        <Select.Popover className={popoverClasses}>
                                            <ListBox className="outline-none">
                                                <ListBox.Item id="full-time" className={listItemClasses} textValue="Full-time">Full-time</ListBox.Item>
                                                <ListBox.Item id="part-time" className={listItemClasses} textValue="Part-time">Part-time</ListBox.Item>
                                                <ListBox.Item id="contract" className={listItemClasses} textValue="Contract">Contract</ListBox.Item>
                                                <ListBox.Item id="internship" className={listItemClasses} textValue="Internship">Internship</ListBox.Item>
                                            </ListBox>
                                        </Select.Popover>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <div className="col-span-2 space-y-1">
                                        <span className="text-zinc-400 font-medium text-sm block">Salary Range</span>
                                        <div className="flex gap-2">
                                            <TextField name="minSalary" isInvalid={!!errors.minSalary} className="w-full">
                                                <Input 
                                                    placeholder="Min" 
                                                    type="number" 
                                                    className={textInputClass}
                                                    value={formState.minSalary}
                                                    onChange={(e) => handleInputChange('minSalary', e.target.value)}
                                                />
                                            </TextField>
                                            <TextField name="maxSalary" isInvalid={!!errors.maxSalary} className="w-full">
                                                <Input 
                                                    placeholder="Max" 
                                                    type="number" 
                                                    className={textInputClass}
                                                    value={formState.maxSalary}
                                                    onChange={(e) => handleInputChange('maxSalary', e.target.value)}
                                                />
                                            </TextField>
                                        </div>
                                    </div>

                                    <Select 
                                        className="w-full mt-6"
                                        aria-label="Currency"
                                        defaultSelectedKeys={["USD"]}
                                        selectedKeys={[formState.currency]}
                                        onSelectionChange={(keys) => {
                                            const value = Array.from(keys)[0];
                                            handleInputChange('currency', value);
                                        }}
                                    >
                                        <Select.Trigger className={triggerClasses}>
                                            <Select.Value />
                                            <Select.Indicator />
                                        </Select.Trigger>
                                        <Select.Popover className={popoverClasses}>
                                            <ListBox className="outline-none">
                                                <ListBox.Item id="USD" className={listItemClasses} textValue="USD">USD ($)</ListBox.Item>
                                                <ListBox.Item id="EUR" className={listItemClasses} textValue="EUR">EUR (€)</ListBox.Item>
                                                <ListBox.Item id="GBP" className={listItemClasses} textValue="GBP">GBP (£)</ListBox.Item>
                                            </ListBox>
                                        </Select.Popover>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-zinc-400 font-medium text-sm">Location</span>

                                        <Switch
                                            isSelected={isRemote}
                                            onChange={setIsRemote}
                                            size="sm"
                                            aria-label="Toggle remote work"
                                        >
                                            <Switch.Control className="bg-zinc-800 data-[selected=true]:bg-white">
                                                <Switch.Thumb className="bg-zinc-400 data-[selected=true]:bg-black" />
                                            </Switch.Control>
                                            <Switch.Content>
                                                <Label className="text-xs text-zinc-400 font-medium">Remote</Label>
                                            </Switch.Content>
                                        </Switch>
                                    </div>

                                    <div className="flex flex-col gap-1 relative">
                                        <div className="relative flex items-center">
                                            <Globe size={16} className="absolute left-3 text-zinc-600 pointer-events-none z-10" />
                                            <Input
                                                placeholder={isRemote ? "Global / Remote" : "e.g. Austin, TX"}
                                                disabled={isRemote}
                                                className={`${textInputClass} pl-10`}
                                                value={formState.location}
                                                onChange={(e) => handleInputChange('location', e.target.value)}
                                            />
                                        </div>
                                        {!isRemote && errors.location && <span className="text-xs text-danger mt-1">{errors.location}</span>}
                                    </div>
                                </div>

                                <TextField name="deadline" isInvalid={!!errors.deadline} className="flex flex-col gap-1 w-full">
                                    <Label className="text-zinc-400 font-medium text-sm">Application Deadline</Label>
                                    <Input 
                                        type="date" 
                                        className={textInputClass}
                                        value={formState.deadline}
                                        onChange={(e) => handleInputChange('deadline', e.target.value)}
                                    />
                                    {errors.deadline && <FieldError className="text-xs text-danger mt-1">{errors.deadline}</FieldError>}
                                </TextField>
                            </div>
                        </Fieldset>

                        {/* SECTION 2: Job Description */}
                        <Fieldset className="space-y-6 w-full">
                            <legend className="text-lg font-medium text-zinc-300 border-b border-zinc-900 w-full pb-2 mb-2">
                                Job Details & Description
                            </legend>

                            <TextField name="responsibilities" isInvalid={!!errors.responsibilities} className="flex flex-col gap-1 w-full">
                                <Label className="text-zinc-400 font-medium text-sm">Responsibilities</Label>
                                <TextArea
                                    placeholder="Outline the core everyday responsibilities for this role..."
                                    rows={4}
                                    className={textAreaClass}
                                    value={formState.responsibilities}
                                    onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                                />
                                {errors.responsibilities && <FieldError className="text-xs text-danger mt-1">{errors.responsibilities}</FieldError>}
                            </TextField>

                            <TextField name="requirements" isInvalid={!!errors.requirements} className="flex flex-col gap-1 w-full">
                                <Label className="text-zinc-400 font-medium text-sm">Requirements</Label>
                                <TextArea
                                    placeholder="List required experience, skills, and certifications..."
                                    rows={4}
                                    className={textAreaClass}
                                    value={formState.requirements}
                                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                                />
                                {errors.requirements && <FieldError className="text-xs text-danger mt-1">{errors.requirements}</FieldError>}
                            </TextField>

                            <TextField name="benefits" className="flex flex-col gap-1 w-full">
                                <Label className="text-zinc-400 font-medium text-sm">Benefits (Optional)</Label>
                                <TextArea
                                    placeholder="Perks, healthcare, equity, remote stipends..."
                                    rows={3}
                                    className={textAreaClass}
                                    value={formState.benefits}
                                    onChange={(e) => handleInputChange('benefits', e.target.value)}
                                />
                            </TextField>
                        </Fieldset>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800 w-full">
                            <Button
                                type="button"
                                variant="bordered"
                                className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 rounded-lg px-6 font-medium h-11"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-white text-black font-semibold hover:bg-zinc-200 rounded-lg px-6 transition-colors h-11 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Posting...' : 'Post Job'}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}