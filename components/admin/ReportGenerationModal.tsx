'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ReportTemplate } from '@/lib/services/reportingService';
import { Calendar, FileText, Download } from 'lucide-react';

interface ReportGenerationModalProps {
    isOpen: boolean;
    onClose: () => void;
    template: ReportTemplate | null;
    onGenerate: (
        templateId: string,
        parameters: Record<string, any>,
        format: 'pdf' | 'excel' | 'csv',
    ) => void;
}

export function ReportGenerationModal({
    isOpen,
    onClose,
    template,
    onGenerate,
}: ReportGenerationModalProps) {
    const [parameters, setParameters] = useState<Record<string, any>>({});
    const [format, setFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (template) {
            // Initialize parameters with default values
            const defaultParams: Record<string, any> = {};
            template.parameters.forEach((param) => {
                if (param.defaultValue !== undefined) {
                    defaultParams[param.id] = param.defaultValue;
                }
            });
            setParameters(defaultParams);
        }
    }, [template]);

    const handleParameterChange = (paramId: string, value: any) => {
        setParameters((prev) => ({
            ...prev,
            [paramId]: value,
        }));
    };

    const handleGenerate = async () => {
        if (!template) return;

        setIsGenerating(true);
        try {
            await onGenerate(template.id, parameters, format);
            onClose();
        } catch (error) {
            console.error('Error generating report:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const renderParameterInput = (param: any) => {
        switch (param.type) {
            case 'text':
                return (
                    <Input
                        value={parameters[param.id] || ''}
                        onChange={(e) => handleParameterChange(param.id, e.target.value)}
                        placeholder={param.name}
                        data-oid=".xv6kin"
                    />
                );

            case 'number':
                return (
                    <Input
                        type="number"
                        value={parameters[param.id] || ''}
                        onChange={(e) => handleParameterChange(param.id, Number(e.target.value))}
                        placeholder={param.name}
                        min={param.validation?.min}
                        max={param.validation?.max}
                        data-oid="gc.6.e_"
                    />
                );

            case 'select':
                return (
                    <Select
                        value={parameters[param.id] || ''}
                        onValueChange={(value) => handleParameterChange(param.id, value)}
                        data-oid="6c0ju_g"
                    >
                        <SelectTrigger data-oid="fvu.jnr">
                            <SelectValue placeholder={`Select ${param.name}`} data-oid="-9m4wrh" />
                        </SelectTrigger>
                        <SelectContent data-oid="4mg219w">
                            {param.options?.map((option: any) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    data-oid="u5gu:hw"
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case 'multiSelect':
                return (
                    <div className="space-y-2" data-oid="2kuya9e">
                        {param.options?.map((option: any) => (
                            <div
                                key={option.value}
                                className="flex items-center space-x-2"
                                data-oid="p.gka4b"
                            >
                                <Checkbox
                                    id={`${param.id}-${option.value}`}
                                    checked={(parameters[param.id] || []).includes(option.value)}
                                    onCheckedChange={(checked) => {
                                        const currentValues = parameters[param.id] || [];
                                        if (checked) {
                                            handleParameterChange(param.id, [
                                                ...currentValues,
                                                option.value,
                                            ]);
                                        } else {
                                            handleParameterChange(
                                                param.id,
                                                currentValues.filter(
                                                    (v: any) => v !== option.value,
                                                ),
                                            );
                                        }
                                    }}
                                    data-oid="56:tu7a"
                                />

                                <Label htmlFor={`${param.id}-${option.value}`} data-oid="0hmdzfo">
                                    {option.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                );

            case 'date':
                return (
                    <Input
                        type="date"
                        value={parameters[param.id] || ''}
                        onChange={(e) => handleParameterChange(param.id, e.target.value)}
                        data-oid=":kol5jn"
                    />
                );

            case 'dateRange':
                return (
                    <div className="grid grid-cols-2 gap-2" data-oid="t1g.b_x">
                        <div data-oid="sao2meu">
                            <Label className="text-xs text-gray-500" data-oid="de:3q-0">
                                Start Date
                            </Label>
                            <Input
                                type="date"
                                value={parameters[param.id]?.start || ''}
                                onChange={(e) =>
                                    handleParameterChange(param.id, {
                                        ...parameters[param.id],
                                        start: e.target.value,
                                    })
                                }
                                data-oid="q8ggi92"
                            />
                        </div>
                        <div data-oid="2m7o8mt">
                            <Label className="text-xs text-gray-500" data-oid="r761l3b">
                                End Date
                            </Label>
                            <Input
                                type="date"
                                value={parameters[param.id]?.end || ''}
                                onChange={(e) =>
                                    handleParameterChange(param.id, {
                                        ...parameters[param.id],
                                        end: e.target.value,
                                    })
                                }
                                data-oid="c-p_qts"
                            />
                        </div>
                    </div>
                );

            default:
                return (
                    <Input
                        value={parameters[param.id] || ''}
                        onChange={(e) => handleParameterChange(param.id, e.target.value)}
                        placeholder={param.name}
                        data-oid="2e85.:o"
                    />
                );
        }
    };

    if (!template) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose} data-oid="zezx4xv">
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" data-oid="ut0pb51">
                <DialogHeader data-oid="ea9grvy">
                    <DialogTitle className="flex items-center space-x-2" data-oid="p8oj5an">
                        <FileText className="w-5 h-5" data-oid="m43q7e0" />
                        <span data-oid="2d42p9x">Generate Report: {template.name}</span>
                    </DialogTitle>
                    <DialogDescription data-oid="vr-3dbb">{template.description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6" data-oid="k19r9t5">
                    {/* Report Parameters */}
                    {template.parameters.length > 0 && (
                        <div className="space-y-4" data-oid="bio-jjr">
                            <h3 className="text-lg font-semibold" data-oid="5i7q1lk">
                                Report Parameters
                            </h3>
                            {template.parameters.map((param) => (
                                <div key={param.id} className="space-y-2" data-oid="2n-g051">
                                    <Label
                                        className="flex items-center space-x-1"
                                        data-oid="-hklami"
                                    >
                                        <span data-oid="34y43rp">{param.name}</span>
                                        {param.required && (
                                            <span className="text-red-500" data-oid="xkttnc3">
                                                *
                                            </span>
                                        )}
                                    </Label>
                                    {renderParameterInput(param)}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Format Selection */}
                    <div className="space-y-2" data-oid="0z5u7x2">
                        <Label data-oid="iwt7oc.">Output Format</Label>
                        <Select
                            value={format}
                            onValueChange={(value: 'pdf' | 'excel' | 'csv') => setFormat(value)}
                            data-oid="4e8uobp"
                        >
                            <SelectTrigger data-oid="8wy:2.j">
                                <SelectValue data-oid="ai-hmx9" />
                            </SelectTrigger>
                            <SelectContent data-oid="q4ld-.5">
                                <SelectItem value="pdf" data-oid="dkmi8j1">
                                    PDF Document
                                </SelectItem>
                                <SelectItem value="excel" data-oid="dtyhncy">
                                    Excel Spreadsheet
                                </SelectItem>
                                <SelectItem value="csv" data-oid="ydzdedg">
                                    CSV File
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Report Info */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2" data-oid="3v2oncc">
                        <h4 className="font-medium" data-oid="xp741kx">
                            Report Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm" data-oid="ztp:luq">
                            <div data-oid="dxl-x9a">
                                <span className="text-gray-500" data-oid="oa:bl_q">
                                    Category:
                                </span>
                                <span className="ml-2 capitalize" data-oid="51d5t7.">
                                    {template.category}
                                </span>
                            </div>
                            <div data-oid="jj.uha9">
                                <span className="text-gray-500" data-oid="57oed.v">
                                    Type:
                                </span>
                                <span className="ml-2 capitalize" data-oid="arokvlw">
                                    {template.type}
                                </span>
                            </div>
                            <div data-oid="h18vkh5">
                                <span className="text-gray-500" data-oid="-.pneja">
                                    Frequency:
                                </span>
                                <span className="ml-2 capitalize" data-oid="gyfp-:1">
                                    {template.frequency}
                                </span>
                            </div>
                            <div data-oid="1ifv53:">
                                <span className="text-gray-500" data-oid="pgjm8qd">
                                    Format:
                                </span>
                                <span className="ml-2 uppercase" data-oid="0fcqboj">
                                    {format}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t" data-oid="55v9xub">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isGenerating}
                            data-oid="080hf7x"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="bg-[#1F1F6F] hover:bg-[#14274E]"
                            data-oid="86:xw3e"
                        >
                            {isGenerating ? (
                                <>
                                    <div
                                        className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                                        data-oid=".v:-krh"
                                    ></div>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4 mr-2" data-oid="xa63xgd" />
                                    Generate Report
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
