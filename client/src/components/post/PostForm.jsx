import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImagePlus, Save, Trash2 } from 'lucide-react'
import { apiUploadImages } from '@/apis/post'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { availabilityStatuses, directions, getDistrictsByProvince, getPropertyTypesForListing, isHomestay, legalStatuses, listingTypes, provinceNames } from '@/lib/constants'
import { toast } from '@/lib/utils'

const schema = z.object({
    title: z.string().min(5, 'Tiêu đề tối thiểu 5 ký tự'),
    address: z.string().min(3, 'Vui lòng nhập địa chỉ'),
    province: z.string().min(1, 'Chọn tỉnh thành'),
    district: z.string().optional(),
    ward: z.string().optional(),
    price: z.coerce.number().min(0, 'Giá không hợp lệ'),
    size: z.coerce.number().min(1, 'Diện tích không hợp lệ'),
    bedroom: z.coerce.number().min(0).optional(),
    bathroom: z.coerce.number().min(0).optional(),
    floor: z.coerce.number().min(0).optional(),
    direction: z.string().optional(),
    balonDirection: z.string().optional(),
    propertyType: z.string().min(1, 'Chọn loại BĐS'),
    listingType: z.string().min(1, 'Chọn nhu cầu'),
    availabilityStatus: z.string().optional(),
    legalStatus: z.string().optional(),
    latitude: z.coerce.number().optional().or(z.literal('')),
    longitude: z.coerce.number().optional().or(z.literal('')),
    isFurniture: z.boolean().optional(),
    description: z.string().optional(),
})

const baseValues = {
    title: '',
    address: '',
    province: '',
    district: '',
    ward: '',
    price: 0,
    size: 0,
    bedroom: 0,
    bathroom: 0,
    floor: 0,
    direction: '',
    balonDirection: '',
    propertyType: '',
    listingType: 'Bán',
    availabilityStatus: 'available',
    legalStatus: '',
    latitude: '',
    longitude: '',
    isFurniture: false,
    description: '',
}

const SelectField = ({ form, name, label, options, placeholder }) => (
    <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <select className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm" {...field}>
                        <option value="">{placeholder || 'Chọn'}</option>
                        {options.map((option) => {
                            const value = option.value || option
                            const label = option.label || option
                            return <option key={value} value={value}>{label}</option>
                        })}
                    </select>
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
)

const InputField = ({ form, name, label, type = 'text', placeholder }) => (
    <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Input type={type} placeholder={placeholder} {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
)

const PostForm = ({ initialPost, submitLabel = 'Lưu tin', onSubmit }) => {
    const [images, setImages] = useState([])
    const [coverImage, setCoverImage] = useState('')
    const [tagsText, setTagsText] = useState('')
    const [uploading, setUploading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const defaultValues = useMemo(() => ({ ...baseValues, ...(initialPost || {}) }), [initialPost])
    const form = useForm({ resolver: zodResolver(schema), defaultValues })
    const listingType = form.watch('listingType')
    const propertyType = form.watch('propertyType')
    const province = form.watch('province')
    const district = form.watch('district')
    const propertyOptions = useMemo(() => getPropertyTypesForListing(listingType), [listingType])
    const districtOptions = useMemo(() => getDistrictsByProvince(province), [province])
    const priceLabel = listingType === 'Cho thuê'
        ? isHomestay(propertyType) ? 'Giá thuê theo đêm (VND)' : 'Giá thuê theo tháng (VND)'
        : 'Giá bán (VND)'

    useEffect(() => {
        form.reset(defaultValues)
        const currentImages = Array.isArray(initialPost?.images) ? initialPost.images : []
        setImages(currentImages)
        setCoverImage(initialPost?.coverImage || currentImages[0] || '')
        setTagsText((initialPost?.tags || []).map((tag) => tag.tag || tag).join(', '))
    }, [defaultValues, form, initialPost])

    useEffect(() => {
        if (propertyType && !propertyOptions.includes(propertyType)) {
            form.setValue('propertyType', '')
        }
    }, [form, propertyOptions, propertyType])

    useEffect(() => {
        if (district && districtOptions.length && !districtOptions.includes(district)) {
            form.setValue('district', '')
        }
    }, [district, districtOptions, form])

    const uploadImages = async (event) => {
        const files = Array.from(event.target.files || [])
        if (!files.length) return
        const formData = new FormData()
        files.forEach((file) => formData.append('images', file))
        setUploading(true)
        try {
            const { data } = await apiUploadImages(formData)
            const urls = data?.urls || []
            setImages((current) => [...current, ...urls])
            setCoverImage((current) => current || urls[0] || '')
            toast('Đã tải ảnh lên')
        } catch (err) {
            toast(err?.response?.data?.msg || 'Không thể tải ảnh', true)
        } finally {
            setUploading(false)
            event.target.value = ''
        }
    }

    const submit = async (values) => {
        setSubmitting(true)
        try {
            const tags = tagsText.split(',').map((item) => item.trim()).filter(Boolean)
            await onSubmit?.({
                ...values,
                price: Number(values.price || 0),
                size: Number(values.size || 0),
                bedroom: Number(values.bedroom || 0),
                bathroom: Number(values.bathroom || 0),
                floor: Number(values.floor || 0),
                latitude: values.latitude === '' ? null : Number(values.latitude || 0),
                longitude: values.longitude === '' ? null : Number(values.longitude || 0),
                images,
                coverImage: coverImage || images[0] || null,
                tags,
            })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="space-y-6 rounded-lg border bg-white p-5">
                <div className="grid gap-4 md:grid-cols-2">
                    <InputField form={form} name="title" label="Tiêu đề" placeholder="Ví dụ: Nhà phố trung tâm, hẻm xe hơi" />
                    <InputField form={form} name="address" label="Địa chỉ" placeholder="Số nhà, đường, phường..." />
                    <SelectField form={form} name="listingType" label="Nhu cầu" options={listingTypes} />
                    <SelectField form={form} name="propertyType" label="Loại BĐS" options={propertyOptions} />
                    <SelectField form={form} name="availabilityStatus" label="Tình trạng giao dịch" options={availabilityStatuses} />
                    <SelectField form={form} name="legalStatus" label="Pháp lý" options={legalStatuses} placeholder="Không chọn" />
                    <SelectField form={form} name="province" label="Tỉnh thành" options={provinceNames} />
                    <SelectField form={form} name="district" label="Quận/Huyện" options={districtOptions} placeholder={province ? 'Chọn quận/huyện' : 'Chọn tỉnh trước'} />
                    <InputField form={form} name="ward" label="Phường/Xã" />
                    <InputField form={form} name="price" label={priceLabel} type="number" />
                    <InputField form={form} name="size" label="Diện tích (m²)" type="number" />
                    <InputField form={form} name="bedroom" label="Phòng ngủ" type="number" />
                    <InputField form={form} name="bathroom" label="Phòng tắm" type="number" />
                    <InputField form={form} name="floor" label="Số tầng" type="number" />
                    <SelectField form={form} name="direction" label="Hướng nhà" options={directions} placeholder="Không chọn" />
                    <SelectField form={form} name="balonDirection" label="Hướng ban công" options={directions} placeholder="Không chọn" />
                    <InputField form={form} name="latitude" label="Vĩ độ" type="number" />
                    <InputField form={form} name="longitude" label="Kinh độ" type="number" />
                </div>

                {isHomestay(propertyType) && (
                    <div className="rounded-md border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">
                        Homestay nên ghi rõ giá theo đêm, số khách tối đa, giờ check-in/check-out, phụ thu cuối tuần và tiện ích như bếp, máy giặt, chỗ đậu xe.
                    </div>
                )}

                <FormField
                    control={form.control}
                    name="isFurniture"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                            <FormControl>
                                <input type="checkbox" className="h-4 w-4 accent-main" checked={!!field.value} onChange={(event) => field.onChange(event.target.checked)} />
                            </FormControl>
                            <FormLabel className="m-0">Có nội thất</FormLabel>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mô tả</FormLabel>
                            <FormControl>
                                <textarea rows={6} className="w-full rounded-md border border-slate-300 p-3 text-sm" placeholder="Mô tả vị trí, pháp lý, tiện ích..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div>
                    <label className="mb-2 block text-sm font-medium">Tags</label>
                    <Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="View đẹp, gần trường, khu an ninh" />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">Hình ảnh</label>
                    <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-main px-4 font-bold text-main hover:bg-slate-100">
                        <ImagePlus className="h-4 w-4" /> {uploading ? 'Đang tải...' : 'Tải ảnh'}
                        <input type="file" className="hidden" multiple accept="image/*" onChange={uploadImages} disabled={uploading} />
                    </label>
                    {images.length > 0 && (
                        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                            {images.map((src) => (
                                <div key={src} className="relative h-28 overflow-hidden rounded-md bg-slate-100">
                                    <img src={src} alt="" className="h-full w-full object-cover" />
                                    <button type="button" onClick={() => setCoverImage(src)} className="absolute bottom-1 left-1 rounded bg-white/90 px-2 py-1 text-xs font-semibold text-main">
                                        {coverImage === src ? 'Ảnh bìa' : 'Chọn bìa'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImages((current) => current.filter((item) => item !== src))
                                            setCoverImage((current) => current === src ? '' : current)
                                        }}
                                        className="absolute right-1 top-1 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-red-500"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Button type="submit" disabled={submitting || uploading}>
                    <Save className="h-4 w-4" /> {submitting ? 'Đang lưu...' : submitLabel}
                </Button>
            </form>
        </Form>
    )
}

export default PostForm
