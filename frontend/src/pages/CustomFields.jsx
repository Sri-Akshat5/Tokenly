import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Database,
    Plus,
    Trash2,
    CheckCircle2,
    XCircle,
    Info,
    Check,
    AlertCircle,
    Type,
    Hash,
    ToggleLeft,
    Calendar as CalendarIcon
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import api from '../services/api';
import ApplicationHeader from '../components/ApplicationHeader';

export default function CustomFields() {
    const { appId } = useParams();
    const [application, setApplication] = useState(null);
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        loadData();
    }, [appId]);

    const loadData = async () => {
        try {
            const [appRes, fieldsRes] = await Promise.all([
                api.get(`/applications/${appId}`),
                api.get(`/admin/${appId}/fields`)
            ]);
            setApplication(appRes.data.data);
            setFields(fieldsRes.data.data || []);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteField = async (fieldName) => {
        if (!confirm(`Are you sure you want to delete the field "${fieldName}"? This will stop collecting this data for new users.`)) {
            return;
        }
        try {
            await api.delete(`/admin/${appId}/fields/${fieldName}`);
            loadData();
        } catch (error) {
            console.error('Failed to delete field:', error);
            alert('Failed to delete field');
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto pb-12">
                <ApplicationHeader
                    application={application}
                    appId={appId}
                    activeTab="custom-fields"
                    icon={Database}
                    actions={
                        <Button onClick={() => setShowAddModal(true)} className="shadow-lg shadow-white/10">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Custom Field
                        </Button>
                    }
                />

                {/* Content */}
                <div className="grid grid-cols-1 gap-6">
                    {fields.length === 0 ? (
                        <Card className="p-20 text-center flex flex-col items-center justify-center border-dashed border-2 border-zinc-800">
                            <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mb-6 text-zinc-600">
                                <Database className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No custom fields defined</h3>
                            <p className="text-zinc-400 max-w-sm mx-auto mb-8">
                                Define additional attributes to collect from your users during signup (e.g. phone, address, company).
                            </p>
                            <Button onClick={() => setShowAddModal(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Define First Field
                            </Button>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {fields.map((field) => (
                                <FieldCard
                                    key={field.fieldName}
                                    field={field}
                                    onDelete={handleDeleteField}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Card */}
                <div className="mt-12 p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl flex items-start gap-4">
                    <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400">
                        <Info className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-1">How Custom Fields Work</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed max-w-2xl">
                            Custom fields allow you to extend the user profile with your own data schema. Once defined, these fields will be validated and stored automatically when a user signs up or updates their profile.
                        </p>
                    </div>
                </div>

                {/* Add Field Modal */}
                <AddFieldModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    appId={appId}
                    onSuccess={() => {
                        setShowAddModal(false);
                        loadData();
                    }}
                />
            </div>
        </DashboardLayout>
    );
}

function FieldCard({ field, onDelete }) {
    const typeIcons = {
        STRING: Type,
        NUMBER: Hash,
        BOOLEAN: ToggleLeft,
        DATE: CalendarIcon,
    };

    const Icon = typeIcons[field.fieldType] || Database;

    return (
        <Card className="p-6 group hover:border-zinc-700 transition-all">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-800 rounded-xl text-zinc-400 group-hover:text-emerald-400 transition-colors">
                        <Icon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-0.5">{field.fieldName}</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{field.fieldType}</span>
                            {field.required && (
                                <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[9px] px-1.5 py-0">REQUIRED</Badge>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => onDelete(field.fieldName)}
                    className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete Field"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[11px] font-medium transition-colors ${field.displayInSignup
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                    : 'bg-zinc-800/20 border-zinc-800 text-zinc-600'
                    }`}>
                    {field.displayInSignup ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    Signup Form
                </div>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[11px] font-medium transition-colors ${field.displayInLogin
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                    : 'bg-zinc-800/20 border-zinc-800 text-zinc-600'
                    }`}>
                    {field.displayInLogin ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    Login Flow
                </div>
            </div>
        </Card>
    );
}

function AddFieldModal({ isOpen, onClose, appId, onSuccess }) {
    const [formData, setFormData] = useState({
        fieldName: '',
        fieldType: 'STRING',
        required: false,
        displayInSignup: true,
        displayInLogin: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const SUGGESTIONS = [
        { name: 'Full Name', type: 'STRING', signup: true },
        { name: 'Phone Number', type: 'STRING', signup: true },
        { name: 'Company', type: 'STRING', signup: true },
        { name: 'Job Title', type: 'STRING', signup: true },
        { name: 'Department', type: 'STRING', signup: false },
        { name: 'Plan Level', type: 'STRING', signup: false },
        { name: 'Birth Date', type: 'DATE', signup: false },
        { name: 'Newsletter', type: 'BOOLEAN', signup: true },
        { name: 'LinkedIn URL', type: 'STRING', signup: false },
        { name: 'Twitter Handle', type: 'STRING', signup: false },
    ];

    const applySuggestion = (sug) => {
        setFormData({
            ...formData,
            fieldName: sug.name.toLowerCase().replace(/\s+/g, '_'),
            fieldType: sug.type,
            displayInSignup: sug.signup
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post(`/admin/${appId}/fields`, formData);
            onSuccess();
            setFormData({
                fieldName: '',
                fieldType: 'STRING',
                required: false,
                displayInSignup: true,
                displayInLogin: false,
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add field');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create Custom Attribute"
            footer={
                <div className="flex gap-4 w-full">
                    <Button variant="secondary" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                        {loading ? 'Creating...' : 'Create Field'}
                    </Button>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                <Input
                    label="Attribute Key (No spaces)"
                    placeholder="e.g. phoneNumber, age, business_name"
                    value={formData.fieldName}
                    onChange={(e) => setFormData({ ...formData, fieldName: e.target.value })}
                    required
                    autoFocus
                />

                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block px-1">Quick Suggestions</label>
                    <div className="flex flex-wrap gap-2">
                        {SUGGESTIONS.map((sug) => (
                            <button
                                key={sug.name}
                                type="button"
                                onClick={() => applySuggestion(sug)}
                                className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 text-xs text-zinc-400 hover:border-zinc-700 hover:text-white transition-all"
                            >
                                + {sug.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                        Data Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { id: 'STRING', label: 'Text', icon: Type },
                            { id: 'NUMBER', label: 'Number', icon: Hash },
                            { id: 'BOOLEAN', label: 'Boolean', icon: ToggleLeft },
                            { id: 'DATE', label: 'Date', icon: CalendarIcon },
                        ].map((type) => (
                            <button
                                key={type.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, fieldType: type.id })}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${formData.fieldType === type.id
                                    ? 'bg-white border-white text-black shadow-lg shadow-white/5'
                                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                    }`}
                            >
                                <type.icon className="w-4 h-4" />
                                <span className="text-sm font-semibold">{type.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                    <Checkbox
                        label="Strict Requirement"
                        description="User cannot proceed without this field"
                        checked={formData.required}
                        onChange={(val) => setFormData({ ...formData, required: val })}
                    />
                    <div className="h-px bg-zinc-800 my-1" />
                    <Checkbox
                        label="Include in Signup"
                        description="Show this field on the registration page"
                        checked={formData.displayInSignup}
                        onChange={(val) => setFormData({ ...formData, displayInSignup: val })}
                    />
                    <div className="h-px bg-zinc-800 my-1" />
                    <Checkbox
                        label="Include in Login"
                        description="Collect this missing info during login"
                        checked={formData.displayInLogin}
                        onChange={(val) => setFormData({ ...formData, displayInLogin: val })}
                    />
                </div>
            </form>
        </Modal>
    );
}

function Checkbox({ label, description, checked, onChange }) {
    return (
        <div
            className="flex items-start gap-4 cursor-pointer group"
            onClick={() => onChange(!checked)}
        >
            <div className="pt-1">
                <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${checked
                    ? 'bg-white border-white text-black'
                    : 'border-zinc-700 bg-zinc-900 group-hover:border-zinc-500'
                    }`}>
                    {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
            </div>
            <div>
                <p className={`text-sm font-bold transition-colors ${checked ? 'text-white' : 'text-zinc-400'}`}>{label}</p>
                <p className="text-[11px] text-zinc-600 group-hover:text-zinc-500 transition-colors">{description}</p>
            </div>
        </div>
    );
}
