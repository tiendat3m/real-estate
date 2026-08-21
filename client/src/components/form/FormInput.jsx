import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { placeholderCn, resetOutline } from '@/lib/classnames'
import PropTypes from 'prop-types'
import { cn } from '@/lib/utils'
const FormInput = ({ form, label, name, type = 'text', placeholder }) => {
    return (
        <FormField
            name={name}
            control={form.control}
            render={({ field }) =>
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input placeholder={placeholder} type={type} className={cn(resetOutline, placeholderCn)} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>}
        />
    )
}

export default FormInput
FormInput.propTypes = {
    form: PropTypes.shape({
        control: PropTypes.any.isRequired
    }),
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    type: PropTypes.oneOf(['text', 'password'])
}
