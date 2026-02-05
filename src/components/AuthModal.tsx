import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Icon from '@/components/ui/icon'
import { useToast } from '@/hooks/use-toast'

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAuthSuccess: (user: any) => void
}

export function AuthModal({ open, onOpenChange, onAuthSuccess }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')
  const { toast } = useToast()

  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    full_name: '',
  })

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })

  const [verificationCode, setVerificationCode] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('https://functions.poehali.dev/9b171cac-2330-4bf0-b623-fab7ad4eb70b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          ...registerData,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'Регистрация успешна!',
          description: `Код подтверждения: ${data.verification_code}`,
        })
        setVerificationEmail(registerData.email)
        setNeedsVerification(true)
      } else {
        toast({
          title: 'Ошибка',
          description: data.error,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось подключиться к серверу',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('https://functions.poehali.dev/9b171cac-2330-4bf0-b623-fab7ad4eb70b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          email: verificationEmail,
          code: verificationCode,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'Email подтвержден!',
          description: 'Теперь вы можете войти в систему',
        })
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('userId', data.user_id)
        setNeedsVerification(false)
        onAuthSuccess({ id: data.user_id })
        onOpenChange(false)
      } else {
        toast({
          title: 'Ошибка',
          description: data.error,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось подключиться к серверу',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('https://functions.poehali.dev/9b171cac-2330-4bf0-b623-fab7ad4eb70b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          ...loginData,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'Добро пожаловать!',
          description: 'Вы успешно вошли в систему',
        })
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('userId', data.user.id)
        localStorage.setItem('userEmail', data.user.email)
        onAuthSuccess(data.user)
        onOpenChange(false)
      } else {
        toast({
          title: 'Ошибка',
          description: data.error,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось подключиться к серверу',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (needsVerification) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение email</DialogTitle>
            <DialogDescription>
              Введите код подтверждения, отправленный на {verificationEmail}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <Label htmlFor="code">Код подтверждения</Label>
              <Input
                id="code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Введите 6-значный код"
                maxLength={6}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Проверка...' : 'Подтвердить'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Вход в NeveMarket</DialogTitle>
          <DialogDescription>
            Войдите или создайте новый аккаунт
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="login-password">Пароль</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                <Icon name="LogIn" size={18} />
                {isLoading ? 'Вход...' : 'Войти'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="register-name">Имя</Label>
                <Input
                  id="register-name"
                  value={registerData.full_name}
                  onChange={(e) => setRegisterData({ ...registerData, full_name: e.target.value })}
                  placeholder="Ваше имя"
                  required
                />
              </div>
              <div>
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="register-password">Пароль</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                <Icon name="UserPlus" size={18} />
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
