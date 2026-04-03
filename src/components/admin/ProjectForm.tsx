import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CloudProject, createCloudProject, updateCloudProject } from '@/services/projects'
import { Customer } from '@/services/customers'
import { useToast } from '@/components/ui/use-toast'
import { ScrollArea } from '@/components/ui/scroll-area'

const formSchema = z.object({
  client_id: z.string().min(1, 'Selecione um cliente'),
  name: z.string().min(3, 'Nome muito curto'),
  address_street: z.string().min(1, 'Rua obrigatória'),
  address_number: z.string().min(1, 'Número obrigatório'),
  address_complement: z.string().optional(),
  address_city: z.string().min(1, 'Cidade obrigatória'),
  address_state: z.string().length(2, 'Estado (UF) deve ter 2 letras'),
  address_zip: z.string().min(8, 'CEP inválido'),
  start_date: z.string().min(1, 'Data de início obrigatória'),
  deadline_days: z.coerce.number().min(1, 'Prazo inválido'),
  total_value: z.string().min(1, 'Valor obrigatório'),
  description: z.string().optional(),
  status: z.enum(['Planning', 'In Execution', 'Paused', 'Completed']),
})

type FormValues = z.infer<typeof formSchema>

function parseCurrencyValue(val: string) {
  return Number(val.replace(/\D/g, '')) / 100
}

function maskCurrency(value: string) {
  let v = value.replace(/\D/g, '')
  if (!v) return 'R$ 0,00'
  v = (Number(v) / 100).toFixed(2) + ''
  v = v.replace('.', ',')
  v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
  return 'R$ ' + v
}

export function ProjectForm({
  project,
  customers,
  onClose,
}: {
  project: CloudProject | null
  customers: Customer[]
  onClose: () => void
}) {
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: '',
      name: '',
      address_street: '',
      address_number: '',
      address_complement: '',
      address_city: '',
      address_state: '',
      address_zip: '',
      start_date: new Date().toISOString().split('T')[0],
      deadline_days: 30,
      total_value: 'R$ 0,00',
      description: '',
      status: 'Planning',
    },
  })

  useEffect(() => {
    if (project) {
      form.reset({
        client_id: project.client_id,
        name: project.name,
        address_street: project.address_street || '',
        address_number: project.address_number || '',
        address_complement: project.address_complement || '',
        address_city: project.address_city || '',
        address_state: project.address_state || '',
        address_zip: project.address_zip || '',
        start_date: project.start_date.split('T')[0],
        deadline_days: project.deadline_days,
        total_value: maskCurrency((project.total_value * 100).toFixed(0)),
        description: project.description || '',
        status: project.status,
      })
    }
  }, [project, form])

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        ...data,
        total_value: parseCurrencyValue(data.total_value),
        start_date: new Date(data.start_date + 'T12:00:00Z').toISOString(),
      }
      if (project) {
        await updateCloudProject(project.id, payload)
        toast({ title: 'Obra atualizada com sucesso!' })
      } else {
        await createCloudProject(payload)
        toast({ title: 'Obra criada com sucesso!' })
      }
      onClose()
    } catch (err) {
      toast({ title: 'Erro ao salvar obra.', variant: 'destructive' })
    }
  }

  return (
    <Sheet open={true} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-xl flex flex-col h-full bg-white sm:w-[500px]">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl font-bold text-gray-900">
            {project ? 'Editar Obra' : 'Nova Obra'}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 -mx-6 px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pb-6">
              <FormField
                control={form.control}
                name="client_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Obra</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Residência Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address_zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="00000-000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address_street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rua</FormLabel>
                      <FormControl>
                        <Input placeholder="Av. Principal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address_complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input placeholder="Sala 4" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="São Paulo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address_state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado (UF)</FormLabel>
                      <FormControl>
                        <Input placeholder="SP" maxLength={2} className="uppercase" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Início</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deadline_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prazo (dias)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="total_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Total</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => field.onChange(maskCurrency(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Planning">Planejamento</SelectItem>
                          <SelectItem value="In Execution">Em Execução</SelectItem>
                          <SelectItem value="Paused">Pausada</SelectItem>
                          <SelectItem value="Completed">Concluída</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição dos Serviços</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detalhes da obra..."
                        className="h-24 resize-none"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 border-t mt-8">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow"
                >
                  {project ? 'Salvar Alterações' : 'Criar Obra'}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
