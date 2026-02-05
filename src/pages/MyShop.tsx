import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Icon from '@/components/ui/icon'
import { useToast } from '@/hooks/use-toast'

interface Product {
  id: number
  title: string
  price: number
  category_name: string
  status: string
  created_at: string
}

const MyShop = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const { toast } = useToast()

  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    category_id: '',
    price: '',
    image_url: 'https://cdn.poehali.dev/projects/5d528024-11ab-4b3d-8bec-efcf2eae5a94/files/381d4752-4e2e-46d3-b18c-baba7198be70.jpg',
  })

  const categories = [
    { id: 1, name: 'Telegram каналы' },
    { id: 2, name: 'Игровые аккаунты' },
    { id: 3, name: 'Telegram Star' },
    { id: 4, name: 'Telegram Premium' },
  ]

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    const userId = localStorage.getItem('userId')
    if (!userId) return

    setIsLoading(true)
    try {
      const response = await fetch(
        `https://functions.poehali.dev/76c1a76d-3f55-4561-9e76-8337ca69e8dc?seller_id=${userId}`
      )
      const data = await response.json()

      if (response.ok) {
        setProducts(data.products)
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить товары',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    const userId = localStorage.getItem('userId')
    if (!userId) return

    setIsLoading(true)
    try {
      const response = await fetch('https://functions.poehali.dev/76c1a76d-3f55-4561-9e76-8337ca69e8dc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seller_id: parseInt(userId),
          ...newProduct,
          category_id: parseInt(newProduct.category_id),
          price: parseFloat(newProduct.price),
        }),
      })

      if (response.ok) {
        toast({
          title: 'Товар добавлен',
          description: 'Товар успешно добавлен в каталог',
        })
        setAddDialogOpen(false)
        setNewProduct({
          title: '',
          description: '',
          category_id: '',
          price: '',
          image_url: 'https://cdn.poehali.dev/projects/5d528024-11ab-4b3d-8bec-efcf2eae5a94/files/381d4752-4e2e-46d3-b18c-baba7198be70.jpg',
        })
        loadProducts()
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить товар',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img 
              src="https://cdn.poehali.dev/projects/5d528024-11ab-4b3d-8bec-efcf2eae5a94/files/381d4752-4e2e-46d3-b18c-baba7198be70.jpg" 
              alt="NeveMarket" 
              className="h-10 w-10 rounded-lg"
            />
            <span className="text-xl font-bold text-primary">Мой магазин</span>
          </div>

          <Button variant="outline" onClick={() => window.location.href = '/'}>
            <Icon name="ArrowLeft" size={18} className="mr-2" />
            На главную
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Мои товары</h1>
            <p className="text-muted-foreground">Управляйте своими предложениями</p>
          </div>

          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Icon name="Plus" size={20} />
                Добавить товар
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Добавить новый товар</DialogTitle>
                <DialogDescription>
                  Заполните информацию о товаре
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <Label htmlFor="title">Название товара</Label>
                  <Input
                    id="title"
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                    placeholder="Название вашего товара"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Подробное описание товара"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Категория</Label>
                    <Select
                      value={newProduct.category_id}
                      onValueChange={(value) => setNewProduct({ ...newProduct, category_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="price">Цена (₽)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Добавление...' : 'Добавить товар'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full text-center py-12">Загрузка...</div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Icon name="Package" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">У вас пока нет товаров</p>
              <Button className="mt-4" onClick={() => setAddDialogOpen(true)}>
                Добавить первый товар
              </Button>
            </div>
          ) : (
            products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <Badge>{product.category_name}</Badge>
                    <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                      {product.status === 'active' ? 'Активен' : 'Неактивен'}
                    </Badge>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{product.title}</h3>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {product.price.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Icon name="Edit" size={16} className="mr-2" />
                      Редактировать
                    </Button>
                    <Button variant="outline" size="sm">
                      <Icon name="MoreVertical" size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Icon name="Package" size={28} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Всего товаров</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Icon name="ShoppingCart" size={28} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Продано</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Icon name="Wallet" size={28} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Баланс</p>
                <p className="text-2xl font-bold">0 ₽</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default MyShop
