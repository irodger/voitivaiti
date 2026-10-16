import { ArrowDownLeft,CheckCircle2,Wallet } from 'lucide-react';
import { text } from '../content/localization';
import './moneyReceipt.css';
import { Button,Modal } from './shared';
import { useMoneyReceipt } from './useMoneyReceipt';
const copy:Record<string,[string,string]>={title:['Деньги поступили','Money received'],salary:['Зарплата за день','Daily salary'],other:['Баланс вырос','Balance increased'],balance:['Теперь на счету','Current balance'],net:['Изменение баланса за действие','Balance change for this action'],note:['Выплата уже учтена. Изменение баланса учитывает также расходы и другие поступления этого действия.','Payment is already included. The balance change also includes expenses and other income from this action.'],close:['Продолжить','Continue']};
Object.entries(copy).forEach(([id,[ru,en]])=>text('receipt.'+id,ru,en));
export function MoneyReceipt(){
const model=useMoneyReceipt();if(!model)return null;const {w,t,receipt,money}=model;

 return <Modal title={t('receipt.title')} onClose={w.dismissMoneyArrival}><div className="money-receipt"><span className="receipt-icon"><ArrowDownLeft size={32}/></span><small>{t(receipt.salary?'receipt.salary':'receipt.other')}</small><strong>+{money(receipt.amount)}</strong><div><Wallet size={18}/><span>{t('receipt.balance')}</span><b>{money(receipt.balance)}</b></div><div><CheckCircle2 size={18}/><span>{t('receipt.net')}</span><b>{receipt.net>0?'+':''}{money(receipt.net)}</b></div><p>{t('receipt.note')}</p><Button onClick={w.dismissMoneyArrival}>{t('receipt.close')}</Button></div></Modal>;
}
