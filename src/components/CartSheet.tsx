import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import Icon from '@/components/ui/icon'
import { useToast } from '@/hooks/use-toast'

interface CartItem {
  id: number
  product_id: number
  title: string
  price: number
  quantity: number
  image_url: string
  category_name: string
}

interface CartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: number | null
}

export function CartSheet({ open, onOpenChange, userId }: CartSheetProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open && userId) {
      loadCart()
    }
  }, [open, userId])

  const loadCart = async () => {
    if (!userId) return

    setIsLoading(true)
    try {
      const response = await fetch(
        `https://functions.poehali.dev/71ed6a81-59be-4417-9788-a26c2747e5c5?user_id=${userId}`
      )
      const data = await response.json()

      if (response.ok) {
        setCartItems(data.cart)
        setTotal(data.total)
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить корзину',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (cartId: number) => {
    try {
      const response = await fetch('https://functions.poehali.dev/71ed6a81-59be-4417-9788-a26c2747e5c5', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart_id: cartId }),
      })

      if (response.ok) {
        toast({
          title: 'Удалено',
          description: 'Товар удален из корзины',
        })
        loadCart()
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить товар',
        variant: 'destructive',
      })
    }
  }

  const handleCheckout = () => {
    toast({
      title: 'Оформление заказа',
      description: 'Функция оплаты будет доступна в следующей версии',
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Корзина</SheetTitle>
          <SheetDescription>
            {cartItems.length} товаров на сумму {total.toLocaleString('ru-RU')} ₽
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Загрузка...</div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="ShoppingCart" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Корзина пуста</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 border rounded-lg p-4">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <Badge variant="outline" className="mt-1">
                        {item.category_name}
                      </Badge>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-bold text-primary">
                          {item.price.toLocaleString('ru-RU')} ₽
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Итого:</span>
                  <span className="text-primary">{total.toLocaleString('ru-RU')} ₽</span>
                </div>
                <Button className="w-full gap-2" size="lg" onClick={handleCheckout}>
                  <Icon name="CreditCard" size={20} />
                  Оформить заказ
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
